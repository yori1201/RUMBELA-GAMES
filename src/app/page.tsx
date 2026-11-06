"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import AnimatedBackground from "@/components/game/AnimatedBackground"
import Confetti from "@/components/game/Confetti"
import HomeScreen, { type GameMode } from "@/components/game/HomeScreen"
import QuizMode from "@/components/game/QuizMode"
import WordMatchMode from "@/components/game/WordMatchMode"
import FillBlankMode from "@/components/game/FillBlankMode"
import SpellMode from "@/components/game/SpellMode"
import MathMode from "@/components/game/MathMode"
import ResultScreen from "@/components/game/ResultScreen"
import AccessGate, { checkExistingAccess, clearAccess } from "@/components/game/AccessGate"
import AdminPanel from "@/components/game/AdminPanel"
import OnboardingScreen from "@/components/game/OnboardingScreen"
import LevelPathMap from "@/components/game/LevelPathMap"
import type { Achievement, CategoryId, Difficulty, Mission } from "@/lib/game-data"
import type { MathLevel } from "@/lib/math-data"
import type { EducationStage } from "@/lib/curriculum-data"
import { useGameStore } from "@/lib/game-store"
import { soundManager } from "@/lib/sound"

type Screen = "access" | "onboarding" | "home" | "level-map" | "playing" | "playing-math" | "result" | "admin"

// PRD Section 5.2: profile persisted per student
interface StudentProfile {
  displayName: string
  educationStage: EducationStage
  gradeCode: string
  onboardedAt: string
}

const PROFILE_KEY = "rumbela-student-profile"

function loadStudentProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as StudentProfile) : null
  } catch {
    return null
  }
}

function saveStudentProfile(profile: StudentProfile) {
  if (typeof window === "undefined") return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

interface GameConfig {
  category: CategoryId
  difficulty: Difficulty
  mode: GameMode
}

interface MathConfig {
  level: MathLevel
}

interface GameResult {
  score: number
  correct: number
  total: number
  maxStreak: number
}

interface ResultMeta {
  newAchievements: Achievement[]
  rank: number
  completedMissions: Mission[]
  streakIncreased: boolean
}

// Determine initial screen based on URL + localStorage access (called once, lazily)
function getInitialScreen(isAdmin: boolean): Screen {
  if (typeof window === "undefined") return "access"
  if (isAdmin) return "admin"
  if (!checkExistingAccess()) return "access"
  // PRD Section 5.2: if access valid but profile not yet completed, show onboarding
  if (!loadStudentProfile()) return "onboarding"
  return "home"
}

// HomeContent uses useSearchParams() which requires a Suspense boundary
// for static prerendering in Next.js.
function HomeContent() {
  // Check URL for admin mode (must be in client component)
  const searchParams = useSearchParams()
  const isAdminMode = searchParams.get("admin") === "1"

  // Initial screen - lazy init based on URL + localStorage
  const [screen, setScreen] = useState<Screen>(() => getInitialScreen(isAdminMode))
  const [config, setConfig] = useState<GameConfig | null>(null)
  const [mathConfig, setMathConfig] = useState<MathConfig | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [resultMeta, setResultMeta] = useState<ResultMeta | null>(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const { recordGameResult, playerName, setPlayerName } = useGameStore()

  // If existing access and player name not set, set it
  useEffect(() => {
    if (screen === "home" && !playerName) {
      const existing = checkExistingAccess()
      if (existing?.name) {
        setPlayerName(existing.name)
      }
    }
  }, [screen, playerName, setPlayerName])

  const handleAccessGranted = useCallback(
    (deviceToken: string, deviceName: string) => {
      // Set player name from access gate
      setPlayerName(deviceName)
      // PRD Section 5.2: route to onboarding if profile not yet completed
      if (!loadStudentProfile()) {
        setScreen("onboarding")
      } else {
        setScreen("home")
      }
    },
    [setPlayerName]
  )

  const handleOnboardingComplete = useCallback(
    (profile: {
      displayName: string
      educationStage: EducationStage
      gradeCode: string
    }) => {
      const fullProfile: StudentProfile = {
        ...profile,
        onboardedAt: new Date().toISOString(),
      }
      saveStudentProfile(fullProfile)
      setPlayerName(profile.displayName)
      soundManager.play("select")
      // PRD: confetti to celebrate onboarding completion
      setConfettiTrigger((t) => t + 1)
      setScreen("home")
    },
    [setPlayerName]
  )

  const handleStart = (cfg: GameConfig) => {
    setConfig(cfg)
    setScreen("playing")
  }

  const handleStartMath = (level: MathLevel) => {
    setMathConfig({ level })
    setScreen("playing-math")
  }

  const handleComplete = useCallback(
    (res: GameResult) => {
      if (!config) return
      const { newAchievements, rank, completedMissions, streakIncreased } = recordGameResult(
        res.score,
        res.correct,
        res.total,
        config.category,
        config.difficulty,
        res.maxStreak,
        config.mode
      )
      setResult(res)
      setResultMeta({ newAchievements, rank, completedMissions, streakIncreased })
      setScreen("result")
      if (res.total > 0 && res.correct / res.total >= 0.7) {
        setConfettiTrigger((t) => t + 1)
      }
      if (completedMissions.length > 0) {
        setTimeout(() => setConfettiTrigger((t) => t + 1), 800)
      }
    },
    [config, recordGameResult]
  )

  const handleMathComplete = useCallback(
    (res: GameResult) => {
      if (!mathConfig) return
      // Tech debt: game-store.recordGameResult mengharuskan CategoryId & Difficulty
      // dari skema Bahasa Inggris. Math dipaksa ke "vocabulary/beginner" supaya masuk
      // leaderboard, walau tidak akurat. Solusi: extend CategoryId dengan "math" dan
      // Difficulty dengan level math (TK/SD/SMP). Untuk sekarang, "math" di mode
      // sudah cukup untuk filter display di UI.
      const { newAchievements, rank, completedMissions, streakIncreased } = recordGameResult(
        res.score,
        res.correct,
        res.total,
        "vocabulary",
        "beginner",
        res.maxStreak,
        "math"
      )
      setResult(res)
      setResultMeta({ newAchievements, rank, completedMissions, streakIncreased })
      setScreen("result")
      if (res.total > 0 && res.correct / res.total >= 0.7) {
        setConfettiTrigger((t) => t + 1)
      }
      if (completedMissions.length > 0) {
        setTimeout(() => setConfettiTrigger((t) => t + 1), 800)
      }
    },
    [mathConfig, recordGameResult]
  )

  const handlePlayAgain = () => {
    if (mathConfig) {
      setScreen("playing-math")
      setResult(null)
      setResultMeta(null)
      return
    }
    if (config) {
      setScreen("playing")
      setResult(null)
      setResultMeta(null)
    }
  }

  const handleHome = () => {
    setScreen("home")
    setConfig(null)
    setMathConfig(null)
    setResult(null)
    setResultMeta(null)
  }

  const handleExitAdmin = () => {
    // Remove ?admin=1 from URL
    window.history.replaceState({}, "", "/")
    setScreen(checkExistingAccess() ? "home" : "access")
  }

  const getLives = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "beginner":
        return 5
      case "intermediate":
        return 4
      case "advanced":
        return 3
    }
  }

  const getQuestionTime = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "beginner":
        return 30
      case "intermediate":
        return 25
      case "advanced":
        return 20
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {screen !== "access" && screen !== "admin" && (
        <>
          <AnimatedBackground />
          <Confetti trigger={confettiTrigger} />
        </>
      )}

      {screen === "access" && (
        <AccessGate onAccessGranted={handleAccessGranted} />
      )}

      {screen === "onboarding" && (
        <>
          <AnimatedBackground />
          <OnboardingScreen
            defaultName={playerName}
            onComplete={handleOnboardingComplete}
            onCancel={() => {
              clearAccess()
              setScreen("access")
            }}
          />
        </>
      )}

      {screen === "admin" && (
        <AdminPanel onExit={handleExitAdmin} />
      )}

      {screen === "home" && (
        <HomeScreen
          onStart={handleStart}
          onStartMath={handleStartMath}
          onStartMathViaMap={() => {
            soundManager.play("click")
            setScreen("level-map")
          }}
        />
      )}

      {screen === "level-map" && (
        <LevelPathMap
          unlockedLevels={["tk", "sd"]}
          completedLevels={[]}
          onSelectLevel={(level) => {
            handleStartMath(level)
          }}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "playing" && config && (
        <>
          {config.mode === "quiz" && (
            <QuizMode
              category={config.category}
              difficulty={config.difficulty}
              maxLives={getLives(config.difficulty)}
              questionTime={getQuestionTime(config.difficulty)}
              onComplete={handleComplete}
              onExit={handleHome}
            />
          )}
          {config.mode === "match" && (
            <WordMatchMode
              category={config.category}
              difficulty={config.difficulty}
              maxLives={getLives(config.difficulty)}
              onComplete={handleComplete}
              onExit={handleHome}
            />
          )}
          {config.mode === "fill-blank" && (
            <FillBlankMode
              category={config.category}
              difficulty={config.difficulty}
              maxLives={getLives(config.difficulty)}
              onComplete={handleComplete}
              onExit={handleHome}
            />
          )}
          {config.mode === "spell" && (
            <SpellMode
              category={config.category}
              difficulty={config.difficulty}
              maxLives={getLives(config.difficulty)}
              onComplete={handleComplete}
              onExit={handleHome}
            />
          )}
        </>
      )}

      {screen === "playing-math" && mathConfig && (
        <MathMode
          level={mathConfig.level}
          onComplete={handleMathComplete}
          onExit={handleHome}
        />
      )}

      {screen === "result" && result && resultMeta && (
        <ResultScreen
          result={result}
          category={config?.category || "vocabulary"}
          difficulty={config?.difficulty || "beginner"}
          mode={mathConfig ? "math" : (config?.mode || "quiz")}
          playerName={playerName}
          newAchievements={resultMeta.newAchievements}
          rank={resultMeta.rank}
          completedMissions={resultMeta.completedMissions}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      )}
    </main>
  )
}

// Loading fallback shown while Suspense resolves (server render)
function HomeLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="text-center">
        <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
        <p className="text-sm font-bold text-slate-500">Memuat Rumbela...</p>
      </div>
    </div>
  )
}

// Main export - wraps HomeContent in Suspense so useSearchParams()
// doesn't break static prerendering (Next.js requirement)
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  )
}
