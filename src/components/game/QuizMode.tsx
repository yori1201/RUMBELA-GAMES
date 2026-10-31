"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Lightbulb, ArrowRight, Volume2 } from "lucide-react"
import {
  getQuestionsByCategory,
  shuffleArray,
  type QuizQuestion,
  type CategoryId,
  type Difficulty,
} from "@/lib/game-data"
import { soundManager } from "@/lib/sound"
import { useNaturalTTS } from "@/lib/use-natural-tts"
import { Button } from "@/components/ui/button"
import HUD from "./HUD"
import Mascot from "./Mascot"

interface QuizModeProps {
  category: CategoryId
  difficulty: Difficulty
  maxLives: number
  questionTime: number
  onComplete: (result: {
    score: number
    correct: number
    total: number
    maxStreak: number
  }) => void
  onExit: () => void
}

interface ShuffledOption {
  text: string
  originalIdx: number
}

export default function QuizMode({
  category,
  difficulty,
  maxLives,
  questionTime,
  onComplete,
  onExit,
}: QuizModeProps) {
  const questions = useMemo(() => {
    const qs = getQuestionsByCategory(category, difficulty, "multiple-choice")
    return shuffleArray(qs).slice(0, 8) as QuizQuestion[]
  }, [category, difficulty])

  // Pre-compute shuffled options for ALL questions once (avoids setState in effect)
  const shuffledOptionsMap = useMemo(() => {
    const map: Record<number, ShuffledOption[]> = {}
    questions.forEach((q, idx) => {
      map[idx] = shuffleArray(
        q.options.map((text, originalIdx) => ({ text, originalIdx }))
      )
    })
    return map
  }, [questions])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [lives, setLives] = useState(maxLives)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questionTime)
  const [correctCount, setCorrectCount] = useState(0)
  const [comboPopup, setComboPopup] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { speak, stop } = useNaturalTTS()

  // Combo popup on streak milestones
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
  const timedOutRef = useRef(false)

  const currentQuestion = questions[currentIdx]
  const totalQuestions = questions.length
  const shuffledOptions = currentQuestion ? shuffledOptionsMap[currentIdx] : []

  const handleTimeUp = useCallback(() => {
    if (showResult || timedOutRef.current) return
    timedOutRef.current = true
    setShowResult(true)
    setSelectedAnswer(-1)
    setLives((l) => l - 1)
    setStreak(0)
    soundManager.play("wrong")
  }, [showResult])

  // Timer effect - uses setTimeout (async), no synchronous setState in effect body
  useEffect(() => {
    if (showResult) return

    timerRef.current = setTimeout(() => {
      if (timeLeft <= 1) {
        // Time's up - handle in async callback (not synchronous in effect)
        handleTimeUp()
      } else {
        if (timeLeft <= 5 && timeLeft > 0) soundManager.play("tick")
        setTimeLeft((t) => t - 1)
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, showResult, handleTimeUp])

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= totalQuestions || lives <= 0) {
      onComplete({
        score,
        correct: correctCount,
        total: totalQuestions,
        maxStreak,
      })
      return
    }
    setCurrentIdx((i) => i + 1)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
    setTimeLeft(questionTime)
    timedOutRef.current = false
  }, [currentIdx, totalQuestions, lives, score, correctCount, maxStreak, onComplete, questionTime])

  const handleAnswer = (originalIdx: number) => {
    if (showResult) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setSelectedAnswer(originalIdx)
    setShowResult(true)

    const isCorrect = originalIdx === currentQuestion.answer
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2)
      const streakBonus = streak * 2
      const points = currentQuestion.points + timeBonus + streakBonus
      setScore((s) => s + points)
      setCorrectCount((c) => c + 1)
      setStreak((s) => {
        const newStreak = s + 1
        setMaxStreak((m) => Math.max(m, newStreak))
        return newStreak
      })
      soundManager.play("correct")
      // Speak the correct answer with natural English pronunciation
      // so siswa bisa belajar cara mengucapkan jawaban yang benar
      const correctAnswerText = currentQuestion.options[currentQuestion.answer]
      speak(correctAnswerText, "en", { rate: 0.85, delay: 500 })
    } else {
      setLives((l) => l - 1)
      setStreak(0)
      soundManager.play("wrong")
      // Tetap speak jawaban yang benar supaya siswa bisa belajar pronunciation
      const correctAnswerText = currentQuestion.options[currentQuestion.answer]
      speak(correctAnswerText, "en", { rate: 0.85, delay: 700 })
    }
  }

  // Replay correct answer pronunciation
  const handleReplayAnswer = () => {
    soundManager.play("click")
    const correctAnswerText = currentQuestion.options[currentQuestion.answer]
    speak(correctAnswerText, "en", { rate: 0.85 })
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Tidak ada soal untuk kombinasi ini.</p>
      </div>
    )
  }

  const isGameOver = lives <= 0

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
        <HUD
          score={score}
          lives={lives}
          maxLives={maxLives}
          streak={streak}
          questionNumber={currentIdx + 1}
          totalQuestions={totalQuestions}
          timeLeft={timeLeft}
          maxTime={questionTime}
        />

        <button
          onClick={() => {
            soundManager.play("click")
            onExit()
          }}
          className="mt-3 text-xs font-semibold text-slate-500 hover:text-rose-500"
        >
          ← Keluar dari game
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="mt-4"
          >
            <div className="rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-slate-100 backdrop-blur-sm sm:p-7">
              <div className="mb-5 text-center">
                <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Question {currentIdx + 1}
                </span>
                <h2 className="text-lg font-bold leading-snug text-slate-800 sm:text-2xl">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.questionTranslation && (
                  <p className="mt-2 text-sm text-slate-500 italic">
                    {currentQuestion.questionTranslation}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {shuffledOptions.map((opt, displayIdx) => {
                  const isSelected = selectedAnswer === opt.originalIdx
                  const isCorrectAnswer = opt.originalIdx === currentQuestion.answer
                  const showCorrect = showResult && isCorrectAnswer
                  const showWrong = showResult && isSelected && !isCorrectAnswer

                  return (
                    <motion.button
                      key={`${currentIdx}-${displayIdx}`}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(opt.originalIdx)}
                      disabled={showResult}
                      className={`relative flex items-center justify-between rounded-2xl p-3.5 text-left font-semibold shadow-sm ring-2 transition-all sm:p-4 ${
                        showCorrect
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-500"
                          : showWrong
                          ? "bg-rose-50 text-rose-700 ring-rose-500"
                          : isSelected
                          ? "bg-emerald-50 ring-emerald-400"
                          : "bg-white text-slate-700 ring-slate-100 hover:ring-emerald-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                            showCorrect
                              ? "bg-emerald-500 text-white"
                              : showWrong
                              ? "bg-rose-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {showCorrect ? (
                            <Check className="h-4 w-4" />
                          ) : showWrong ? (
                            <X className="h-4 w-4" />
                          ) : (
                            String.fromCharCode(65 + displayIdx)
                          )}
                        </span>
                        <span className="text-sm sm:text-base">{opt.text}</span>
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {!showResult && !showHint && (
                <button
                  onClick={() => {
                    setShowHint(true)
                    soundManager.play("click")
                  }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  <Lightbulb className="h-3.5 w-3.5" /> Butuh petunjuk?
                </button>
              )}

              {showHint && !showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800"
                >
                  💡 Petunjuk: Cek terjemahan di bawah pertanyaan. Pilihan yang benar biasanya merupakan kata yang paling umum digunakan.
                </motion.div>
              )}

              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex-1 text-sm text-slate-700">
                        <span className="font-bold">
                          {selectedAnswer === currentQuestion.answer
                            ? "✅ Benar! "
                            : selectedAnswer === -1
                            ? "⏰ Waktu habis! "
                            : "❌ Belum tepat. "}
                        </span>
                        {currentQuestion.explanation}
                      </p>
                      <button
                        onClick={handleReplayAnswer}
                        className="shrink-0 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-200 active:scale-95 transition"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Dengar
                      </button>
                    </div>
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
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-base font-black shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-98 transition"
                  >
                    {isGameOver
                      ? "Lihat Hasil"
                      : currentIdx + 1 >= totalQuestions
                      ? "Selesaikan Game"
                      : "Soal Berikutnya"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {showResult && (
              <div className="mt-4 flex justify-center">
                <Mascot
                  mood={selectedAnswer === currentQuestion.answer ? "celebrating" : "sad"}
                  size={80}
                  message={
                    selectedAnswer === currentQuestion.answer
                      ? "Hebat! Kamu pintar!"
                      : "Jangan menyerah, coba lagi ya!"
                  }
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
