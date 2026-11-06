"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Home, RotateCcw, Trophy, Flame, Target, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { soundManager } from "@/lib/sound"
import {
  CATEGORIES,
  DIFFICULTIES,
  getMissionColorClass,
  type Achievement,
  type CategoryId,
  type Difficulty,
  type Mission,
} from "@/lib/game-data"
import Mascot from "./Mascot"
import { useEffect, useRef, useMemo } from "react"

interface ResultScreenProps {
  result: {
    score: number
    correct: number
    total: number
    maxStreak: number
  }
  category: CategoryId
  difficulty: Difficulty
  mode: string
  playerName: string
  newAchievements: Achievement[]
  rank: number
  completedMissions?: Mission[]
  onPlayAgain: () => void
  onHome: () => void
}

const MODE_LABELS: Record<string, string> = {
  quiz: "Quiz Challenge",
  match: "Word Match",
  "fill-blank": "Fill the Blank",
  spell: "Spell Master",
  math: "Math Adventure",
}

// Falling letter confetti — emoji alfabet dengan warna acak
const LETTER_EMOJIS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const LETTER_COLORS = ["text-rose-400", "text-amber-400", "text-emerald-400", "text-sky-400", "text-violet-400", "text-pink-400", "text-orange-400", "text-cyan-400"]

function FallingLetters({ trigger }: { trigger: number }) {
  // Generate random letters once per trigger
  const letters = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: `${trigger}-${i}`,
      letter: LETTER_EMOJIS[Math.floor(Math.random() * LETTER_EMOJIS.length)],
      color: LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      rotation: Math.random() * 360,
      size: 16 + Math.random() * 18,
    }))
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {letters.map((l) => (
        <motion.div
          key={l.id}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: l.rotation }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeIn",
          }}
          className={`absolute font-black ${l.color}`}
          style={{ left: `${l.left}%`, fontSize: `${l.size}px` }}
        >
          {l.letter}
        </motion.div>
      ))}
    </div>
  )
}

// Smiling star character — bintang dengan wajah tersenyum
function SmilingStar({ size = 32, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.15, rotate: 5 }}
      style={{ width: size, height: size }}
      className="relative"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full drop-shadow-md">
        <path
          d="M12 2L14.39 8.25L21 9.27L16.16 13.88L17.29 20.49L12 17.39L6.71 20.49L7.84 13.88L3 9.27L9.61 8.25L12 2Z"
          fill="#FFD93D"
          stroke="#FFA500"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Eyes */}
        <circle cx="9.5" cy="11" r="0.9" fill="#1F2937" />
        <circle cx="14.5" cy="11" r="0.9" fill="#1F2937" />
        {/* Smile */}
        <path
          d="M9.5 13.5C10.2 14.5 11 15 12 15C13 15 13.8 14.5 14.5 13.5"
          stroke="#1F2937"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cheeks */}
        <circle cx="8" cy="13" r="0.8" fill="#FFB6C1" opacity="0.7" />
        <circle cx="16" cy="13" r="0.8" fill="#FFB6C1" opacity="0.7" />
      </svg>
    </motion.div>
  )
}

// Sad gray star (untuk soal yang salah)
function GrayStar({ size = 28, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring" }}
      style={{ width: size, height: size }}
      className="opacity-60"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
        <path
          d="M12 2L14.39 8.25L21 9.27L16.16 13.88L17.29 20.49L12 17.39L6.71 20.49L7.84 13.88L3 9.27L9.61 8.25L12 2Z"
          fill="#D1D5DB"
          stroke="#9CA3AF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

export default function ResultScreen({
  result,
  category,
  difficulty,
  mode,
  playerName,
  newAchievements,
  rank,
  completedMissions = [],
  onPlayAgain,
  onHome,
}: ResultScreenProps) {
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  const isPerfect = accuracy === 100
  const isPassing = accuracy >= 60
  const wrongCount = result.total - result.correct

  const catInfo = CATEGORIES.find((c) => c.id === category)
  const diffInfo = DIFFICULTIES.find((d) => d.id === difficulty)

  const playWinSound = useRef(false)
  useEffect(() => {
    if (!playWinSound.current) {
      playWinSound.current = true
      if (isPerfect || isPassing) {
        soundManager.play("win")
      } else {
        soundManager.play("lose")
      }
      if (newAchievements.length > 0) {
        setTimeout(() => soundManager.play("achievement"), 1200)
      }
      if (completedMissions.length > 0) {
        setTimeout(() => soundManager.play("achievement"), 1800)
      }
    }
  }, [isPerfect, isPassing, newAchievements.length, completedMissions.length])

  // Trigger falling letters once
  const confettiTrigger = useRef(0)
  if (confettiTrigger.current === 0 && (isPerfect || isPassing)) {
    confettiTrigger.current = Date.now()
  }

  // Calculate star rating (1-3 stars based on accuracy)
  const starCount = isPerfect ? 3 : isPassing && accuracy >= 80 ? 3 : isPassing ? 2 : 1

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      {/* Falling letters confetti — only when passing */}
      {(isPerfect || isPassing) && confettiTrigger.current > 0 && (
        <FallingLetters trigger={confettiTrigger.current} />
      )}

      {/* Decorative scattered stars (only when passing) */}
      {(isPerfect || isPassing) && (
        <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
          <div className="absolute left-4 top-1/4">
            <SmilingStar size={36} delay={0.3} />
          </div>
          <div className="absolute right-6 top-1/3">
            <SmilingStar size={28} delay={0.5} />
          </div>
          <div className="absolute left-1/4 bottom-1/4">
            <SmilingStar size={32} delay={0.7} />
          </div>
          <div className="absolute right-1/4 bottom-1/3">
            <SmilingStar size={40} delay={0.4} />
          </div>
          <div className="absolute left-8 bottom-8">
            <SmilingStar size={24} delay={0.9} />
          </div>
        </div>
      )}

      <div className="relative z-30 mx-auto max-w-3xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-100"
        >
          {/* HERO SECTION — split layout: mascot left, score right */}
          <div
            className={`relative grid grid-cols-1 overflow-hidden sm:grid-cols-2 ${
              isPerfect
                ? "bg-gradient-to-br from-amber-300 via-orange-400 to-rose-400"
                : isPassing
                ? "bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500"
                : "bg-gradient-to-br from-slate-400 to-slate-500"
            }`}
          >
            {/* Decorative clouds in background */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute left-1/4 top-4 h-12 w-20 rounded-full bg-white blur-sm" />
              <div className="absolute right-1/3 top-8 h-8 w-16 rounded-full bg-white blur-sm" />
              <div className="absolute bottom-4 left-1/2 h-10 w-20 rounded-full bg-white blur-sm" />
            </div>

            {/* LEFT: Mascot Bela big & celebrating */}
            <div className="relative flex flex-col items-center justify-center p-5 sm:p-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="relative"
              >
                <Mascot
                  mood={isPerfect ? "celebrating" : isPassing ? "happy" : "sad"}
                  size={140}
                />
              </motion.div>
              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-3 max-w-xs rounded-2xl bg-white px-4 py-2 text-center shadow-lg"
              >
                <p className="text-sm font-bold text-slate-700">
                  {isPerfect
                    ? "Luar biasa! Kamu juara!"
                    : isPassing
                    ? "Kerja bagus! Terus berlatih!"
                    : "Jangan menyerah, coba lagi!"}
                </p>
                {playerName && (
                  <p className="text-xs text-slate-500">— untuk {playerName} 🌱</p>
                )}
              </motion.div>
            </div>

            {/* RIGHT: Score panel */}
            <div className="flex flex-col justify-center bg-white/95 p-5 backdrop-blur-sm sm:p-7">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isPerfect ? "Sempurna!" : isPassing ? "Good job!" : "Tetap semangat!"}
                </p>
                <h1 className="mb-1 text-2xl font-black text-slate-800 sm:text-3xl">
                  {isPerfect
                    ? "🎉 SEMPURNA!"
                    : isPassing
                    ? "👍 Kerja Bagus!"
                    : "😅 Coba Lagi!"}
                </h1>
                <p className="mb-4 text-xs text-slate-500">
                  {MODE_LABELS[mode] || "Game"} · {catInfo?.icon} {catInfo?.name} · {diffInfo?.icon} {diffInfo?.name}
                </p>

                {/* Big smiling stars row (1-3 stars based on performance) */}
                <div className="mb-4 flex items-center justify-center gap-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n}>
                      {n <= starCount ? (
                        <SmilingStar size={48} delay={0.4 + n * 0.15} />
                      ) : (
                        <GrayStar size={40} delay={0.6 + n * 0.1} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Big score display like "10/10" reference */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-center ring-2 ring-emerald-200">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl">✓</span>
                    <span className="text-5xl font-black text-emerald-600 sm:text-6xl">
                      {result.correct}/{result.total}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Jawaban Benar
                  </p>
                </div>

                {/* Wrong count (if any) — like reference "0" gray */}
                {wrongCount > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-slate-400">
                    <span className="text-xl">✗</span>
                    <span className="text-2xl font-black">{wrongCount}</span>
                    <span className="text-xs font-bold uppercase">Salah</span>
                  </div>
                )}
                {wrongCount === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-2 text-center text-xs font-bold text-emerald-600"
                  >
                    ✨ Tanpa kesalahan! ✨
                  </motion.p>
                )}
              </motion.div>
            </div>
          </div>

          {/* BOTTOM: Stats + Achievements + Missions + Actions */}
          <div className="space-y-4 bg-white p-5 sm:p-7">
            {/* Score + Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-amber-50 p-3 text-center ring-1 ring-amber-100">
                <Trophy className="mx-auto mb-1 h-5 w-5 text-amber-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Skor</p>
                <p className="text-base font-black text-amber-700 sm:text-lg">
                  {result.score.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-center ring-1 ring-orange-100">
                <Flame className="mx-auto mb-1 h-5 w-5 text-orange-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Streak</p>
                <p className="text-base font-black text-orange-700 sm:text-lg">{result.maxStreak}x</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-3 text-center ring-1 ring-purple-100">
                <Target className="mx-auto mb-1 h-5 w-5 text-purple-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Akurasi</p>
                <p className="text-base font-black text-purple-700 sm:text-lg">{accuracy}%</p>
              </div>
            </div>

            {rank > 0 && rank <= 10 && (
              <div className="rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 p-3 text-center text-sm font-bold text-amber-700 ring-1 ring-amber-200">
                🏆 Peringkat #{rank} di leaderboard!
              </div>
            )}

            {/* Achievements */}
            <AnimatePresence>
              {newAchievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 ring-1 ring-purple-200"
                >
                  <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-purple-700">
                    🎖️ Achievement Baru!
                  </p>
                  <div className="space-y-2">
                    {newAchievements.map((ach: Achievement) => (
                      <motion.div
                        key={ach.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.7 }}
                        className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                      >
                        <span className="text-3xl">{ach.icon}</span>
                        <div>
                          <p className="font-bold text-purple-700">{ach.name}</p>
                          <p className="text-xs text-slate-500">{ach.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completed Missions */}
            <AnimatePresence>
              {completedMissions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-2xl bg-gradient-to-br from-[#d7ffb8] to-[#ddf4ff] p-4 ring-1 ring-[#58cc02]/30"
                >
                  <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wider text-[#58a700]">
                    🎯 Misi Selesai! Klaim di Halaman Utama
                  </p>
                  <div className="space-y-2">
                    {completedMissions.map((mission: Mission, idx) => {
                      const colors = getMissionColorClass(mission.color)
                      return (
                        <motion.div
                          key={mission.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.7 + idx * 0.1 }}
                          className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ${colors.border} border-2`}
                        >
                          <span className="text-3xl">{mission.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`font-extrabold ${colors.text}`}>{mission.title}</p>
                            <p className="text-xs text-[#777777]">{mission.description}</p>
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-[#fff5cc] px-2.5 py-1 text-xs font-extrabold text-[#998400]">
                            <Sparkles className="h-3 w-3" />
                            +{mission.reward}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons — bigger, mobile-friendly */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  soundManager.play("click")
                  onPlayAgain()
                }}
                className="h-14 flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-base font-black shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-98"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Main Lagi
              </Button>
              <Button
                onClick={() => {
                  soundManager.play("click")
                  onHome()
                }}
                variant="outline"
                className="h-14 flex-1 rounded-2xl text-base font-black active:scale-98"
              >
                <Home className="mr-2 h-5 w-5" /> Kembali
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
