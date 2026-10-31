"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Trophy, Settings, Volume2, VolumeX, Sparkles, BookOpen, Award, RotateCcw, Flame, Target, Star, TrendingUp, Calculator } from "lucide-react"
import { CATEGORIES, DIFFICULTIES, ACHIEVEMENTS, type CategoryId, type Difficulty } from "@/lib/game-data"
import { MATH_LEVELS, type MathLevel } from "@/lib/math-data"
import { useGameStore } from "@/lib/game-store"
import { soundManager } from "@/lib/sound"
import { preloadVoices } from "@/lib/use-natural-tts"
import Mascot from "./Mascot"
import MissionsPanel from "./MissionsPanel"
import MissionBadge from "./MissionBadge"
import StreakBadge from "./StreakBadge"
import DailyCheckIn from "./DailyCheckIn"
import ProgressStats from "./ProgressStats"
import MissionLeaderboard from "./MissionLeaderboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HomeScreenProps {
  onStart: (config: {
    category: CategoryId
    difficulty: Difficulty
    mode: GameMode
  }) => void
  onStartMath?: (level: MathLevel) => void
}

export type GameMode = "quiz" | "match" | "fill-blank" | "spell"

const GAME_MODES: {
  id: GameMode
  name: string
  icon: string
  description: string
  color: string
  gradient: string
}[] = [
  {
    id: "quiz",
    name: "Quiz Challenge",
    icon: "🧠",
    description: "Pilihan ganda dengan timer",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "match",
    name: "Word Match",
    icon: "🔗",
    description: "Cocokkan kata Inggris & Indonesia",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "fill-blank",
    name: "Fill the Blank",
    icon: "✏️",
    description: "Lengkapi kalimat yang kosong",
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "spell",
    name: "Spell Master",
    icon: "🔤",
    description: "Eja kata dengan benar",
    color: "purple",
    gradient: "from-purple-500 to-fuchsia-500",
  },
]

export default function HomeScreen({ onStart, onStartMath }: HomeScreenProps) {
  const { playerName, setPlayerName, stats, leaderboard, unlockedAchievements, resetProgress } = useGameStore()
  const [name, setName] = useState(playerName)
  const [isEditingName, setIsEditingName] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled())
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showMissions, setShowMissions] = useState(false)

  // Pre-load TTS voices on mount so they're ready when needed
  // (browsers load voices async - this prevents fallback to robotic default)
  useEffect(() => {
    preloadVoices()
  }, [])

  const toggleSound = () => {
    const newVal = !soundOn
    setSoundOn(newVal)
    soundManager.setEnabled(newVal)
    if (newVal) soundManager.play("click")
  }

  const handleStart = () => {
    const finalName = (name || playerName || "").trim()
    if (!finalName) {
      soundManager.play("wrong")
      setIsEditingName(true)
      return
    }
    if (!selectedCategory || !selectedDifficulty || !selectedMode) {
      soundManager.play("wrong")
      return
    }
    setPlayerName(finalName)
    setIsEditingName(false)
    soundManager.play("select")
    onStart({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      mode: selectedMode,
    })
  }

  const canStart = (name || playerName || "").trim() && selectedCategory && selectedDifficulty && selectedMode
  const displayName = (name || playerName || "").trim()
  const hasSavedName = !!playerName.trim()

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6">
      {/* Header */}
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Rumbela official logo */}
          <img
            src="/rumbela/logo-full.png"
            alt="Rumbela - Rumah belajar Anak"
            className="h-12 w-auto object-contain drop-shadow-sm sm:h-14"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <StreakBadge />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            className="h-9 w-9 rounded-full"
            aria-label={soundOn ? "Matikan suara" : "Nyalakan suara"}
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <MissionBadge onClick={() => { soundManager.play("click"); setShowMissions(true) }} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              soundManager.play("click")
              setShowLeaderboard(true)
            }}
            className="h-9 w-9 rounded-full"
            aria-label="Leaderboard"
          >
            <Trophy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              soundManager.play("click")
              setShowAchievements(true)
            }}
            className="h-9 w-9 rounded-full"
            aria-label="Achievements"
          >
            <Award className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Daily Check-in + Streak (jika user sudah ada progres) */}
      {stats.totalGamesPlayed > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 max-w-5xl"
        >
          <DailyCheckIn />
        </motion.section>
      )}

      {/* Hero with Mascot */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-6 max-w-5xl"
      >
        <div className="grid grid-cols-1 items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5 shadow-xl ring-1 ring-emerald-100/50 sm:grid-cols-[auto_1fr] sm:p-8">
          <div className="flex justify-center">
            <Mascot mood="happy" size={140} message={`Halo ${name || "teman"}! Ayo belajar bareng Bela!`} />
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <Sparkles className="mr-1 h-3 w-3" /> RUMBELA GAMES
            </Badge>
            <h2 className="text-2xl font-black leading-tight text-slate-800 sm:text-4xl">
              RUMBELA GAMES
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              Belajar Bahasa Inggris & Berhitung jadi seru! Pilih kategori, level, dan mode favoritmu.
              Kumpulkan poin, buka achievement, dan jadi juara bareng Bela!
            </p>
            {stats.totalGamesPlayed > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="bg-white">
                  <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
                  {stats.totalScore.toLocaleString()} pts
                </Badge>
                <Badge variant="secondary" className="bg-white">
                  <Flame className="mr-1 h-3 w-3 text-orange-500" />
                  Streak: {stats.maxStreak}
                </Badge>
                <Badge variant="secondary" className="bg-white">
                  <BookOpen className="mr-1 h-3 w-3 text-emerald-600" />
                  {stats.totalGamesPlayed} game
                </Badge>
                <Badge variant="secondary" className="bg-white">
                  <Award className="mr-1 h-3 w-3 text-purple-600" />
                  {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <div className="mx-auto max-w-5xl space-y-5">
        {/* MATH ADVENTURE - Game Berhitung */}
        {onStartMath && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff4b6e] via-[#ff8c42] to-[#ffc93c] p-5 shadow-xl sm:p-6"
          >
            <div className="absolute right-2 top-2 opacity-30 sm:right-4 sm:top-4">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl sm:text-6xl"
              >
                🎈
              </motion.div>
            </div>
            <div className="relative">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-sm">
                  🧮 Game Berhitung
                </span>
                <span className="rounded-full bg-[#ffc800] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#998400]">
                  BARU!
                </span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                🫧 Math Adventure
              </h2>
              <p className="mt-1 max-w-md text-xs text-white/90 sm:text-sm">
                Pecahkan balon angka dengan suara! Cocok untuk TK, SD, dan SMP.
                Soal berbeda untuk tiap tingkat usia.
              </p>

              {/* Math level selector */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {MATH_LEVELS.map((lv) => (
                  <motion.button
                    key={lv.id}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      soundManager.play("select")
                      onStartMath(lv.id)
                    }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${lv.gradient} p-3 text-left shadow-lg ring-2 ring-white/40 transition-all hover:ring-white`}
                  >
                    <div className="text-2xl">{lv.icon}</div>
                    <p className="mt-1 text-sm font-black text-white drop-shadow">{lv.shortName}</p>
                    <p className="text-[9px] font-medium leading-tight text-white/90">{lv.description.split(",")[0]}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="rounded-full bg-white/30 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {lv.questionCount} soal
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-white/80">
                💡 Tip: Suara akan otomatis membacakan soal. Klik balon angka yang benar!
              </p>
            </div>

            {/* Floating bubble decorations */}
            <motion.div
              className="absolute left-2 bottom-2 text-2xl opacity-50"
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              🔢
            </motion.div>
            <motion.div
              className="absolute right-1/3 bottom-3 text-xl opacity-40"
              animate={{ y: [0, -8, 0], x: [0, -3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1.2 }}
            >
              ✨
            </motion.div>
          </motion.section>
        )}

        {/* Step 1: Player Name (collapsed greeting if already set) */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">1</span>
            {hasSavedName && !isEditingName ? "Pemain" : "Siapa namamu?"}
          </h3>
          {hasSavedName && !isEditingName ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-emerald-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-black text-white shadow-sm">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-black text-slate-800">{playerName}</p>
                  <p className="text-[10px] text-slate-500">Selamat datang kembali! 👋</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  soundManager.play("click")
                  setIsEditingName(true)
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Ganti
              </Button>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tulis namamu di sini..."
                maxLength={20}
                autoFocus
                className="h-12 flex-1 rounded-xl bg-white text-base font-semibold shadow-sm"
              />
              {hasSavedName && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    soundManager.play("click")
                    setName(playerName)
                    setIsEditingName(false)
                  }}
                  className="h-12 rounded-xl px-4 text-sm font-bold"
                >
                  Batal
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Step 2: Category */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">2</span>
            Pilih Kategori
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.play("click")
                  setSelectedCategory(cat.id)
                }}
                className={`relative overflow-hidden rounded-2xl p-4 text-left shadow-md ring-2 transition-all ${
                  selectedCategory === cat.id
                    ? "ring-emerald-500"
                    : "ring-transparent hover:ring-emerald-200"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90`} />
                <div className="relative">
                  <div className="text-3xl">{cat.icon}</div>
                  <h4 className="mt-2 font-black text-white">{cat.name}</h4>
                  <p className="text-xs text-white/90">{cat.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Step 3: Difficulty */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">3</span>
            Pilih Level Kesulitan
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {DIFFICULTIES.map((diff) => (
              <motion.button
                key={diff.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundManager.play("click")
                  setSelectedDifficulty(diff.id)
                }}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 shadow-md ring-2 transition-all ${
                  selectedDifficulty === diff.id
                    ? "bg-emerald-50 ring-emerald-500"
                    : "bg-white ring-transparent hover:ring-emerald-200"
                }`}
              >
                <span className="text-2xl">{diff.icon}</span>
                <span className="text-xs font-bold text-slate-700">{diff.name}</span>
                <span className="text-[10px] text-slate-500">{diff.multiplier}x poin</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Step 4: Game Mode */}
        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white">4</span>
            Pilih Mode Permainan
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GAME_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.play("click")
                  setSelectedMode(mode.id)
                }}
                className={`relative overflow-hidden rounded-2xl p-4 text-left shadow-md ring-2 transition-all ${
                  selectedMode === mode.id
                    ? "ring-emerald-500"
                    : "ring-transparent hover:ring-emerald-200"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-90`} />
                <div className="relative">
                  <div className="text-3xl">{mode.icon}</div>
                  <h4 className="mt-2 font-black text-white">{mode.name}</h4>
                  <p className="text-xs text-white/90">{mode.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky bottom-4 z-20 pt-2"
        >
          <Button
            onClick={handleStart}
            disabled={!canStart}
            size="lg"
            className={`w-full h-14 rounded-2xl text-base font-black shadow-xl transition-all ${
              canStart
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
                : "bg-slate-300 text-slate-500"
            }`}
          >
            {!canStart
              ? "Lengkapi pilihanmu dulu ya!"
              : `🚀 Mulai Petualangan, ${displayName}!`}
          </Button>
        </motion.div>

        {/* Reset progress (only if has progress) */}
        {stats.totalGamesPlayed > 0 && (
          <div className="flex justify-center pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Yakin mau reset semua progres? Skor, achievement, dan leaderboard akan hilang.")) {
                  resetProgress()
                  setName("")
                  setIsEditingName(false)
                  soundManager.play("click")
                }
              }}
              className="text-xs text-slate-400 hover:text-rose-500"
            >
              <RotateCcw className="mr-1 h-3 w-3" /> Reset Progres
            </Button>
          </div>
        )}
      </div>

      {/* Stats & Leaderboard Section (only if has progress) */}
      {stats.totalGamesPlayed > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-8 max-w-5xl"
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black uppercase tracking-wide text-[#4b4b4b]">
            <TrendingUp className="h-5 w-5 text-[#58cc02]" />
            Statistik Belajar
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProgressStats />
            <MissionLeaderboard />
          </div>
        </motion.section>
      )}

      {/* Footer with branding */}
      <footer className="mx-auto mt-8 max-w-5xl border-t border-slate-200/60 px-4 py-6 text-center">
        <img
          src="/rumbela/logo-full.png"
          alt="Rumbela - Rumah belajar Anak"
          className="mx-auto mb-2 h-10 w-auto object-contain opacity-90 sm:h-12"
          draggable={false}
        />
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Rumbela · Rumah belajar Anak · RUMBELA GAMES
        </p>
      </footer>

      {/* Leaderboard Dialog */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Papan Skor Tertinggi
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {leaderboard.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Belum ada skor. Yuk mulai bermain dan jadilah yang pertama!
              </p>
            ) : (
              <ol className="space-y-2">
                {leaderboard.slice(0, 20).map((entry, idx) => (
                  <li
                    key={entry.id}
                    className={`flex items-center gap-3 rounded-xl p-3 ${
                      idx === 0
                        ? "bg-amber-50 ring-1 ring-amber-200"
                        : idx === 1
                        ? "bg-slate-100"
                        : idx === 2
                        ? "bg-orange-50"
                        : "bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                        idx === 0
                          ? "bg-amber-400 text-white"
                          : idx === 1
                          ? "bg-slate-400 text-white"
                          : idx === 2
                          ? "bg-orange-400 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{entry.name}</p>
                      <p className="text-xs text-slate-500">
                        {entry.category} · {entry.difficulty} · {entry.accuracy}% benar
                      </p>
                    </div>
                    <span className="text-sm font-black text-emerald-600">
                      {entry.score}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Achievements Dialog */}
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" /> Koleksi Achievement
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-2 gap-2">
              {ACHIEVEMENTS.map((ach) => {
                const unlocked = unlockedAchievements.includes(ach.id)
                return (
                  <div
                    key={ach.id}
                    className={`rounded-xl p-3 text-center ${
                      unlocked
                        ? "bg-gradient-to-br from-purple-50 to-fuchsia-50 ring-1 ring-purple-200"
                        : "bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="text-3xl">{unlocked ? ach.icon : "🔒"}</div>
                    <p className="mt-1 text-xs font-bold">{ach.name}</p>
                    <p className="text-[10px] text-slate-500">{ach.description}</p>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Missions Dialog */}
      <Dialog open={showMissions} onOpenChange={setShowMissions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#58cc02]" /> Misi Belajar
            </DialogTitle>
          </DialogHeader>
          <MissionsPanel
            onClose={() => setShowMissions(false)}
            onMissionClaimed={(mission, reward) => {
              // Could show toast here
              console.log(`Claimed ${mission.title}: +${reward}`)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
