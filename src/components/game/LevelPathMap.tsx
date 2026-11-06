"use client"

import { motion } from "framer-motion"
import { Lock, Check, Star } from "lucide-react"
import { soundManager } from "@/lib/sound"
import { MATH_LEVELS, type MathLevel } from "@/lib/math-data"

interface LevelPathMapProps {
  onSelectLevel: (level: MathLevel) => void
  unlockedLevels: MathLevel[] // levels yang sudah bisa dimainkan (default: TK & SD unlocked, SMP locked)
  completedLevels?: MathLevel[] // levels yang sudah selesai
  onBack: () => void
}

// Path nodes position dalam grid 5x4 (column, row)
// Sesuai referensi: jalur berliku seperti peta pulau
const PATH_NODES: Array<{
  level: MathLevel
  position: { col: number; row: number } // 1-5 column, 1-4 row
  emoji: string
  label: string
}> = [
  {
    level: "tk",
    position: { col: 1, row: 1 },
    emoji: "🎈",
    label: "TK/PAUD",
  },
  {
    level: "sd",
    position: { col: 3, row: 2 },
    emoji: "✏️",
    label: "SD",
  },
  {
    level: "smp",
    position: { col: 5, row: 3 },
    emoji: "🧮",
    label: "SMP",
  },
]

// Decorative items scattered on the map
const DECORATIONS = [
  { emoji: "🌳", top: "15%", left: "25%", size: "32px" },
  { emoji: "🌻", top: "70%", left: "10%", size: "28px" },
  { emoji: "🍄", top: "85%", left: "60%", size: "26px" },
  { emoji: "🎈", top: "20%", left: "75%", size: "30px" },
  { emoji: "⭐", top: "45%", left: "5%", size: "24px" },
  { emoji: "🌟", top: "30%", left: "50%", size: "22px" },
  { emoji: "📚", top: "80%", left: "85%", size: "28px" },
  { emoji: "🦋", top: "55%", left: "70%", size: "26px" },
  { emoji: "🍎", top: "10%", left: "45%", size: "24px" },
  { emoji: "🎯", top: "65%", left: "40%", size: "26px" },
]

export default function LevelPathMap({
  onSelectLevel,
  unlockedLevels,
  completedLevels = [],
  onBack,
}: LevelPathMapProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 px-4 py-4">
      {/* Header */}
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <button
          onClick={() => {
            soundManager.play("click")
            onBack()
          }}
          className="flex h-11 items-center gap-1 rounded-full bg-white/90 px-4 text-sm font-bold text-slate-700 shadow-md hover:bg-white active:scale-95"
        >
          ← Kembali
        </button>
        <div className="rounded-full bg-rose-500 px-4 py-1.5 text-sm font-black uppercase tracking-wide text-white shadow-md">
          🗺️ Peta Belajar
        </div>
      </div>

      {/* Map title banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto mb-4 max-w-3xl text-center"
      >
        <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
          Pilih Level Berhitung 🎒
        </h2>
        <p className="text-sm text-slate-600">
          Ikuti jalur dari TK ke SMP. Selesaikan level untuk membuka level berikutnya!
        </p>
      </motion.div>

      {/* The actual map */}
      <div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-200 shadow-2xl"
        style={{ aspectRatio: "4 / 3", minHeight: "400px" }}
      >
        {/* Sky/clouds decoration */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-3 h-8 w-16 rounded-full bg-white/80 blur-sm"
          />
          <motion.div
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-6 h-6 w-12 rounded-full bg-white/70 blur-sm"
          />
        </div>

        {/* River decoration */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 0 Q 100 80 80 150 T 120 300"
            stroke="#60a5fa"
            strokeWidth="12"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M 350 50 Q 280 130 320 220 T 280 300"
            stroke="#60a5fa"
            strokeWidth="8"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
        </svg>

        {/* Bridge decoration */}
        <div className="pointer-events-none absolute left-[18%] top-[40%] text-3xl opacity-70">
          🌉
        </div>

        {/* Decorative items scattered */}
        {DECORATIONS.map((dec, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute"
            style={{
              top: dec.top,
              left: dec.left,
              fontSize: dec.size,
            }}
            animate={{
              y: [0, -4, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            {dec.emoji}
          </motion.div>
        ))}

        {/* Dashed path connecting nodes */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 10 25 Q 30 50 50 50 T 90 75"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            fill="none"
            opacity="0.9"
          />
        </svg>

        {/* Level nodes */}
        {PATH_NODES.map((node, idx) => {
          const levelInfo = MATH_LEVELS.find((l) => l.id === node.level)!
          const isUnlocked = unlockedLevels.includes(node.level)
          const isCompleted = completedLevels.includes(node.level)
          const isLocked = !isUnlocked

          // Convert grid position to percentage
          const leftPct = ((node.position.col - 0.5) / 5) * 100
          const topPct = ((node.position.row - 0.5) / 4) * 100

          return (
            <motion.button
              key={node.level}
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.2, type: "spring", stiffness: 200 }}
              whileHover={isUnlocked ? { scale: 1.1, y: -4 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => {
                if (isLocked) {
                  soundManager.play("wrong")
                  return
                }
                soundManager.play("select")
                onSelectLevel(node.level)
              }}
              disabled={isLocked}
              className="absolute flex flex-col items-center"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Level button (big circle) */}
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-xl ring-4 transition-all sm:h-20 sm:w-20 ${
                  isLocked
                    ? "bg-slate-300 ring-slate-200 opacity-70"
                    : isCompleted
                    ? "bg-gradient-to-br from-amber-300 to-orange-400 ring-amber-200"
                    : "bg-gradient-to-br from-sky-400 to-blue-500 ring-white"
                }`}
              >
                {isLocked ? (
                  <Lock className="h-7 w-7 text-slate-500" />
                ) : isCompleted ? (
                  <>
                    <span className="text-2xl sm:text-3xl">{node.emoji}</span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.2, type: "spring" }}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </motion.div>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl">{node.emoji}</span>
                )}

                {/* Pulse ring on unlocked-but-not-completed */}
                {isUnlocked && !isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full ring-4 ring-white"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Label below */}
              <div
                className={`mt-2 rounded-full px-2 py-0.5 text-xs font-black shadow-sm ${
                  isLocked
                    ? "bg-slate-200 text-slate-500"
                    : "bg-white text-slate-800"
                }`}
              >
                {node.label}
              </div>

              {/* Coming soon hint for locked */}
              {isLocked && (
                <p className="mt-1 max-w-[80px] text-center text-[10px] font-semibold text-slate-500">
                  Selesaikan level sebelumnya untuk membuka
                </p>
              )}
            </motion.button>
          )
        })}

        {/* Mascot Bela di pojok */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="absolute bottom-2 left-2"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl"
          >
            🌱
          </motion.div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-500"></div>
          <span className="font-bold text-slate-600">Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-300 to-orange-400"></div>
          <span className="font-bold text-slate-600">Selesai</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full bg-slate-300"></div>
          <span className="font-bold text-slate-600">Terkunci</span>
        </div>
      </div>
    </div>
  )
}
