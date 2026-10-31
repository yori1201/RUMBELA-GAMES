"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Volume2 } from "lucide-react"
import {
  getQuestionsByCategory,
  shuffleArray,
  type FillBlankQuestion,
  type CategoryId,
  type Difficulty,
} from "@/lib/game-data"
import { soundManager } from "@/lib/sound"
import { useNaturalTTS } from "@/lib/use-natural-tts"
import { Button } from "@/components/ui/button"
import HUD from "./HUD"
import Mascot from "./Mascot"

interface FillBlankModeProps {
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

interface ShuffledOption {
  text: string
  originalIdx: number
}

export default function FillBlankMode({
  category,
  difficulty,
  maxLives,
  onComplete,
  onExit,
}: FillBlankModeProps) {
  const questions = useMemo(() => {
    const qs = getQuestionsByCategory(category, difficulty, "fill-blank")
    return shuffleArray(qs).slice(0, 6) as FillBlankQuestion[]
  }, [category, difficulty])

  // Pre-compute shuffled options for all questions (avoids setState in effect)
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
  const [correctCount, setCorrectCount] = useState(0)
  const [comboPopup, setComboPopup] = useState<string | null>(null)
  const { speak, stop } = useNaturalTTS()

  const currentQuestion = questions[currentIdx]
  const shuffledOptions = currentQuestion ? shuffledOptionsMap[currentIdx] : []

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

  const handleAnswer = (originalIdx: number) => {
    if (showResult) return
    setSelectedAnswer(originalIdx)
    setShowResult(true)

    const isCorrect = originalIdx === currentQuestion.answer
    if (isCorrect) {
      const streakBonus = streak * 2
      const points = currentQuestion.points + streakBonus
      setScore((s) => s + points)
      setCorrectCount((c) => c + 1)
      setStreak((s) => {
        const newStreak = s + 1
        setMaxStreak((m) => Math.max(m, newStreak))
        return newStreak
      })
      soundManager.play("correct")
      // Speak the complete sentence with the correct word filled in
      // supaya siswa bisa dengar pronunciation kata & kalimat lengkap
      const correctWord = currentQuestion.options[currentQuestion.answer]
      const fullSentence = currentQuestion.sentence.replace("___", correctWord)
      speak(fullSentence, "en", { rate: 0.88, delay: 500 })
    } else {
      setLives((l) => l - 1)
      setStreak(0)
      soundManager.play("wrong")
      // Tetap speak kalimat lengkap dengan kata benar
      const correctWord = currentQuestion.options[currentQuestion.answer]
      const fullSentence = currentQuestion.sentence.replace("___", correctWord)
      speak(fullSentence, "en", { rate: 0.88, delay: 700 })
    }
  }

  // Replay full sentence pronunciation
  const handleReplaySentence = () => {
    soundManager.play("click")
    const correctWord = currentQuestion.options[currentQuestion.answer]
    const fullSentence = currentQuestion.sentence.replace("___", correctWord)
    speak(fullSentence, "en", { rate: 0.88 })
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
    setSelectedAnswer(null)
    setShowResult(false)
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Tidak ada soal untuk kombinasi ini.</p>
      </div>
    )
  }

  const parts = currentQuestion.sentence.split("___")

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
          totalQuestions={questions.length}
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
                <span className="mb-2 inline-block rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Fill the Blank · {currentIdx + 1}/{questions.length}
                </span>

                <div className="mt-3 text-base font-semibold leading-relaxed text-slate-800 sm:text-xl">
                  {parts[0]}
                  <motion.span
                    animate={
                      showResult
                        ? selectedAnswer === currentQuestion.answer
                          ? { backgroundColor: "#10b981", color: "#ffffff" }
                          : { backgroundColor: "#f43f5e", color: "#ffffff" }
                        : { backgroundColor: "#fef3c7", color: "#92400e" }
                    }
                    className="mx-1 inline-block min-w-[100px] rounded-lg px-3 py-1.5 text-base font-black sm:min-w-[140px] sm:text-lg"
                  >
                    {showResult
                      ? currentQuestion.options[currentQuestion.answer]
                      : selectedAnswer !== null
                      ? shuffledOptions.find((o) => o.originalIdx === selectedAnswer)?.text
                      : "____"}
                  </motion.span>
                  {parts[1]}
                </div>

                <p className="mt-3 text-sm text-slate-500 italic">
                  📝 {currentQuestion.translation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                {shuffledOptions.map((opt, displayIdx) => {
                  const isSelected = selectedAnswer === opt.originalIdx
                  const isCorrectAnswer = opt.originalIdx === currentQuestion.answer
                  const showCorrect = showResult && isCorrectAnswer
                  const showWrong = showResult && isSelected && !isCorrectAnswer

                  return (
                    <motion.button
                      key={`${currentIdx}-${displayIdx}`}
                      whileHover={!showResult ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      onClick={() => handleAnswer(opt.originalIdx)}
                      disabled={showResult}
                      className={`rounded-2xl p-3 text-center font-bold shadow-sm ring-2 transition-all sm:p-4 ${
                        showCorrect
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-500"
                          : showWrong
                          ? "bg-rose-50 text-rose-700 ring-rose-500"
                          : "bg-white text-slate-700 ring-slate-100 hover:ring-rose-300"
                      }`}
                    >
                      <span className="text-sm sm:text-base">{opt.text}</span>
                    </motion.button>
                  )
                })}
              </div>

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
                            : "❌ Belum tepat. "}
                        </span>
                        {currentQuestion.explanation}
                      </p>
                      <button
                        onClick={handleReplaySentence}
                        className="shrink-0 rounded-full bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-200 active:scale-95 transition"
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
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-base font-black shadow-lg hover:from-rose-600 hover:to-pink-700 active:scale-98 transition"
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

            {showResult && (
              <div className="mt-4 flex justify-center">
                <Mascot
                  mood={selectedAnswer === currentQuestion.answer ? "celebrating" : "sad"}
                  size={70}
                  message={
                    selectedAnswer === currentQuestion.answer
                      ? "Pintar sekali!"
                      : "Tetap semangat ya!"
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
