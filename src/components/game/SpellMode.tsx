"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ArrowRight, Volume2, Eye, RotateCw } from "lucide-react"
import {
  getQuestionsByCategory,
  shuffleArray,
  type SpellQuestion,
  type CategoryId,
  type Difficulty,
} from "@/lib/game-data"
import { soundManager } from "@/lib/sound"
import { useNaturalTTS } from "@/lib/use-natural-tts"
import { Button } from "@/components/ui/button"
import HUD from "./HUD"
import Mascot from "./Mascot"

interface SpellModeProps {
  category: CategoryId
  difficulty: Difficulty
  maxLives: number
  onComplete: (result: {
    score: number
    correct: number
    total: number
    maxStreak: number
  }) => void
  onExit: () => void
}

export default function SpellMode({
  category,
  difficulty,
  maxLives,
  onComplete,
  onExit,
}: SpellModeProps) {
  const questions = useMemo(() => {
    const qs = getQuestionsByCategory(category, difficulty, "spell")
    return shuffleArray(qs).slice(0, 6) as SpellQuestion[]
  }, [category, difficulty])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [lives, setLives] = useState(maxLives)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [input, setInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [comboPopup, setComboPopup] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasSpokenRef = useRef(false)
  const { speak, stop } = useNaturalTTS()

  const currentQuestion = questions[currentIdx]

  // Focus input when question changes
  useEffect(() => {
    if (inputRef.current && !showResult) {
      inputRef.current.focus()
    }
  }, [currentIdx, showResult])

  // Auto-speak instruction when new question appears
  useEffect(() => {
    if (!currentQuestion || hasSpokenRef.current) return
    hasSpokenRef.current = true
    const t = setTimeout(() => {
      // Indonesian instruction, natural voice
      speak(`Coba eja kata yang berarti ${currentQuestion.meaning}`, "id", { rate: 0.95, delay: 0 })
    }, 400)
    return () => clearTimeout(t)
  }, [currentQuestion, speak])

  // Show combo popup when streak reaches milestones
  useEffect(() => {
    if (streak >= 3 && streak % 3 === 0) {
      setComboPopup(`🔥 Combo ${streak}x!`)
      const t = setTimeout(() => setComboPopup(null), 1800)
      return () => clearTimeout(t)
    }
  }, [streak])

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => stop()
  }, [stop])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (showResult || !input.trim()) return

    const userAnswer = input.trim().toLowerCase()
    const correctAnswer = currentQuestion.answer.toLowerCase()
    const correct = userAnswer === correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const streakBonus = streak * 3
      const points = currentQuestion.points + streakBonus
      setScore((s) => s + points)
      setCorrectCount((c) => c + 1)
      setStreak((s) => {
        const newStreak = s + 1
        setMaxStreak((m) => Math.max(m, newStreak))
        return newStreak
      })
      soundManager.play("correct")
      // Speak the correct English word with natural pronunciation
      // so anak bisa belajar pronunciation
      speak(currentQuestion.answer, "en", { rate: 0.85, delay: 600 })
    } else {
      setLives((l) => l - 1)
      setStreak(0)
      soundManager.play("wrong")
      // Speak the correct answer so anak bisa dengar pronunciation yang benar
      speak(`Jawabannya: ${currentQuestion.answer}`, "id", { rate: 0.9, delay: 400 })
    }
  }

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length || lives <= 0) {
      onComplete({
        score,
        correct: correctCount,
        total: questions.length,
        maxStreak,
      })
      return
    }
    setCurrentIdx((i) => i + 1)
    setInput("")
    setShowResult(false)
    setShowAnswer(false)
    setIsCorrect(false)
    hasSpokenRef.current = false
  }

  const handleReplayInstruction = () => {
    soundManager.play("click")
    speak(`Coba eja kata yang berarti ${currentQuestion.meaning}`, "id", { rate: 0.95 })
  }

  const handleReplayWord = () => {
    soundManager.play("click")
    speak(currentQuestion.answer, "en", { rate: 0.85 })
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Tidak ada soal untuk kombinasi ini.</p>
      </div>
    )
  }

  // Letter boxes
  const answerLetters = currentQuestion.answer.split("")

  return (
    <div className="min-h-screen w-full px-4 py-4 sm:px-6 sm:py-6">
      {/* Combo popup floating */}
      <AnimatePresence>
        {comboPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1.2, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            className="pointer-events-none fixed left-1/2 top-1/4 z-50 -translate-x-1/2 text-3xl font-black text-orange-500 drop-shadow-lg sm:text-4xl"
          >
            {comboPopup}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-3xl">
        {/* HUD */}
        <HUD
          score={score}
          lives={lives}
          maxLives={maxLives}
          streak={streak}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
        />

        <button
          onClick={() => {
            soundManager.play("click")
            stop()
            onExit()
          }}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-500"
        >
          ← Keluar
        </button>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="mt-4"
          >
            <div className="rounded-3xl bg-white/95 p-4 shadow-2xl ring-1 ring-slate-100 backdrop-blur-sm sm:p-7">
              <div className="mb-4 text-center">
                <span className="mb-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Spell Master · {currentIdx + 1}/{questions.length}
                </span>

                {/* Meaning + Replay button */}
                <div className="mt-3 flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Arti dalam Bahasa Indonesia
                  </p>
                  <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
                    {currentQuestion.meaning}
                  </h2>
                  <button
                    onClick={handleReplayInstruction}
                    className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 active:scale-95 transition"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Putar suara
                  </button>
                </div>

                {/* Hint */}
                <div className="mt-3 inline-block rounded-xl bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700">
                  💡 {currentQuestion.hint} ({currentQuestion.answer.length} huruf)
                </div>
              </div>

              {/* Letter boxes preview */}
              <div className="mb-5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                {answerLetters.map((letter, idx) => {
                  const userLetter = input[idx]?.toLowerCase() || ""
                  const showThis = showResult || (showAnswer && idx < input.length)
                  const isLetterCorrect =
                    showResult && userLetter === letter.toLowerCase()

                  return (
                    <div
                      key={idx}
                      className={`flex h-10 w-9 items-center justify-center rounded-xl border-2 text-xl font-black uppercase transition-all sm:h-12 sm:w-11 ${
                        showResult
                          ? isLetterCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : userLetter
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-slate-300 bg-slate-50 text-slate-400"
                          : userLetter
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-slate-200 bg-white text-slate-300"
                      }`}
                    >
                      {showResult ? letter : userLetter || "_"}
                    </div>
                  )
                })}
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    if (!showResult) setInput(e.target.value)
                  }}
                  disabled={showResult}
                  placeholder="Ketik jawabanmu di sini..."
                  maxLength={currentQuestion.answer.length + 5}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full rounded-2xl border-2 px-4 py-4 text-center text-lg font-bold uppercase shadow-sm outline-none transition-all sm:text-xl ${
                    showResult
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-slate-200 focus:border-purple-500 focus:bg-purple-50/50"
                  }`}
                />

                {/* Hint toggle - bigger touch target */}
                {!showResult && !showAnswer && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnswer(true)
                      soundManager.play("click")
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 active:scale-98 transition"
                  >
                    <Eye className="h-4 w-4" /> Lihat sedikit huruf (-5 poin)
                  </button>
                )}

                {showAnswer && !showResult && (
                  <div className="rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-800">
                    💡 Huruf pertama: <span className="font-black text-base">{currentQuestion.answer[0]}</span>
                    {" · "}
                    Huruf terakhir: <span className="font-black text-base">{currentQuestion.answer[currentQuestion.answer.length - 1]}</span>
                  </div>
                )}

                {/* Submit button - bigger for mobile */}
                {!showResult && (
                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-base font-black shadow-lg hover:from-purple-600 hover:to-fuchsia-700 active:scale-98 transition"
                  >
                    Periksa Jawaban
                  </Button>
                )}
              </form>

              {/* Explanation + Replay word button */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex-1 text-sm text-slate-700">
                        <span className="font-bold">
                          {isCorrect ? "✅ Benar! " : "❌ Belum tepat. "}
                        </span>
                        Jawaban: <span className="font-black text-purple-700 uppercase">{currentQuestion.answer}</span>
                      </p>
                      <button
                        onClick={handleReplayWord}
                        className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-200 active:scale-95 transition"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Dengar
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Contoh: <em>&ldquo;{currentQuestion.example}&rdquo;</em>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Button
                    onClick={handleNext}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-base font-black shadow-lg hover:from-purple-600 hover:to-fuchsia-700 active:scale-98 transition"
                  >
                    {lives <= 0
                      ? "Lihat Hasil"
                      : currentIdx + 1 >= questions.length
                      ? "Selesaikan Game"
                      : "Soal Berikutnya"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mascot reaksi - lebih hidup */}
            {showResult && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-4 flex justify-center"
              >
                <Mascot
                  mood={isCorrect ? "celebrating" : "sad"}
                  size={70}
                  message={
                    isCorrect
                      ? streak >= 3
                        ? `🔥 ${streak}x combo! Hebat!`
                        : "Ejaanmu hebat!"
                      : "Coba diingat lagi ya!"
                  }
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
