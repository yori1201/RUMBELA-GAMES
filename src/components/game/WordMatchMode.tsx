"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Volume2 } from "lucide-react"
import {
  getQuestionsByCategory,
  shuffleArray,
  type MatchQuestion,
  type CategoryId,
  type Difficulty,
} from "@/lib/game-data"
import { soundManager } from "@/lib/sound"
import { useNaturalTTS } from "@/lib/use-natural-tts"
import HUD from "./HUD"
import Mascot from "./Mascot"

interface WordMatchModeProps {
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

interface MatchItem {
  id: string
  text: string
  side: "en" | "id"
  originalIdx: number
}

export default function WordMatchMode({
  category,
  difficulty,
  maxLives,
  onComplete,
  onExit,
}: WordMatchModeProps) {
  const rounds = useMemo(() => {
    const qs = getQuestionsByCategory(category, difficulty, "word-match")
    return shuffleArray(qs).slice(0, 4) as MatchQuestion[]
  }, [category, difficulty])

  // Pre-compute shuffled items for ALL rounds (avoids setState in effect)
  const roundsData = useMemo(() => {
    return rounds.map((round, roundIdx) => {
      const enItems: MatchItem[] = round.pairs.map((p, idx) => ({
        id: `en-${roundIdx}-${idx}`,
        text: p.en,
        side: "en" as const,
        originalIdx: idx,
      }))
      const idItems: MatchItem[] = round.pairs.map((p, idx) => ({
        id: `id-${roundIdx}-${idx}`,
        text: p.id,
        side: "id" as const,
        originalIdx: idx,
      }))
      return {
        leftItems: shuffleArray(enItems),
        rightItems: shuffleArray(idItems),
      }
    })
  }, [rounds])

  const [currentRound, setCurrentRound] = useState(0)
  const [lives, setLives] = useState(maxLives)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedEn, setSelectedEn] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<{ en: string; id: string } | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [comboPopup, setComboPopup] = useState<string | null>(null)
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

  // Refs to access latest state inside async callbacks without re-running effects.
  // Updated in useEffect (not during render) to comply with react-hooks/refs rule.
  const stateRef = useRef({
    matchedPairs: new Set<string>(),
    streak: 0,
    score: 0,
    correctCount: 0,
    maxStreak: 0,
    lives: maxLives,
    currentRound: 0,
  })

  // Sync ref with latest state via effect (NOT during render)
  useEffect(() => {
    stateRef.current = {
      matchedPairs,
      streak,
      score,
      correctCount,
      maxStreak,
      lives,
      currentRound,
    }
  })

  const currentQuestion = rounds[currentRound]
  const { leftItems, rightItems } = roundsData[currentRound] || { leftItems: [], rightItems: [] }
  const totalPairs = rounds.reduce((acc, r) => acc + r.pairs.length, 0)

  const advanceRound = useCallback(() => {
    const state = stateRef.current
    if (state.currentRound + 1 >= rounds.length || state.lives <= 0) {
      onComplete({
        score: state.score,
        correct: state.correctCount,
        total: totalPairs,
        maxStreak: state.maxStreak,
      })
    } else {
      setCurrentRound((r) => r + 1)
      setMatchedPairs(new Set())
      setSelectedEn(null)
      setSelectedId(null)
      setWrongPair(null)
    }
  }, [rounds.length, totalPairs, onComplete])

  const handleSelect = (item: MatchItem) => {
    if (matchedPairs.has(item.originalIdx.toString())) return
    if (wrongPair) return
    soundManager.play("click")

    const newSelectedEn = item.side === "en" ? item.id : selectedEn
    const newSelectedId = item.side === "id" ? item.id : selectedId

    if (item.side === "en") setSelectedEn(item.id)
    else setSelectedId(item.id)

    const enItem = item.side === "en" ? item : leftItems.find((l) => l.id === newSelectedEn)
    const idItem = item.side === "id" ? item : rightItems.find((r) => r.id === newSelectedId)

    if (enItem && idItem && enItem.side !== idItem.side) {
      if (enItem.originalIdx === idItem.originalIdx) {
        // Correct match!
        const currentMatched = new Set(matchedPairs)
        currentMatched.add(enItem.originalIdx.toString())

        const newStreak = streak + 1
        const points = 10 + newStreak * 2
        const newScore = score + points
        const newMaxStreak = Math.max(maxStreak, newStreak)

        setMatchedPairs(currentMatched)
        setScore(newScore)
        setStreak(newStreak)
        setMaxStreak(newMaxStreak)
        soundManager.play("correct")
        setSelectedEn(null)
        setSelectedId(null)

        // Speak the English word that was just matched (natural pronunciation)
        // supaya siswa belajar pronunciation saat match berhasil
        const matchedWord = currentQuestion.pairs[enItem.originalIdx].en
        speak(matchedWord, "en", { rate: 0.85, delay: 200 })

        // Check if round is complete - schedule advance
        if (currentMatched.size === currentQuestion.pairs.length) {
          const newCorrectCount = correctCount + currentQuestion.pairs.length
          setCorrectCount(newCorrectCount)
          soundManager.play("win")

          // Update ref so advanceRound sees fresh values
          stateRef.current = {
            matchedPairs: currentMatched,
            streak: newStreak,
            score: newScore,
            correctCount: newCorrectCount,
            maxStreak: newMaxStreak,
            lives: stateRef.current.lives,
            currentRound: stateRef.current.currentRound,
          }

          setTimeout(() => {
            advanceRound()
          }, 1000)
        }
      } else {
        // Wrong match
        setWrongPair({ en: enItem.id, id: idItem.id })
        setLives((l) => {
          const newLives = l - 1
          stateRef.current.lives = newLives
          return newLives
        })
        setStreak(0)
        soundManager.play("wrong")
        setTimeout(() => {
          setWrongPair(null)
          setSelectedEn(null)
          setSelectedId(null)
        }, 700)
      }
    }
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Tidak ada soal untuk kombinasi ini.</p>
      </div>
    )
  }

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
          questionNumber={currentRound + 1}
          totalQuestions={rounds.length}
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

        <motion.div
          key={currentRound}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-slate-100 backdrop-blur-sm sm:p-7">
            <div className="mb-5 text-center">
              <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Round {currentRound + 1} dari {rounds.length}
              </span>
              <h2 className="text-lg font-bold text-slate-800 sm:text-2xl">
                Cocokkan kata Inggris dengan arti Indonesianya
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Klik satu kata Inggris, lalu klik padanan Indonesianya
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div className="space-y-2.5">
                <h3 className="text-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                  🇬🇧 English
                </h3>
                {leftItems.map((item) => {
                  const isMatched = matchedPairs.has(item.originalIdx.toString())
                  const isSelected = selectedEn === item.id
                  const isWrong = wrongPair?.en === item.id
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={!isMatched ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(item)}
                      disabled={isMatched}
                      animate={
                        isWrong
                          ? { x: [-5, 5, -5, 5, 0] }
                          : isMatched
                          ? { scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={`flex w-full items-center justify-between rounded-2xl p-3 text-left font-bold shadow-sm ring-2 transition-all sm:p-4 ${
                        isMatched
                          ? "bg-emerald-100 text-emerald-700 ring-emerald-300 opacity-60"
                          : isWrong
                          ? "bg-rose-50 text-rose-700 ring-rose-500"
                          : isSelected
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-500"
                          : "bg-white text-slate-700 ring-slate-100 hover:ring-emerald-300"
                      }`}
                    >
                      <span className="text-sm sm:text-base">{item.text}</span>
                      {isMatched && <Check className="h-4 w-4 text-emerald-500" />}
                    </motion.button>
                  )
                })}
              </div>

              <div className="space-y-2.5">
                <h3 className="text-center text-xs font-bold uppercase tracking-wider text-rose-600">
                  🇮🇩 Indonesia
                </h3>
                {rightItems.map((item) => {
                  const isMatched = matchedPairs.has(item.originalIdx.toString())
                  const isSelected = selectedId === item.id
                  const isWrong = wrongPair?.id === item.id
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={!isMatched ? { scale: 1.02 } : {}}
                      whileTap={!isMatched ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(item)}
                      disabled={isMatched}
                      animate={
                        isWrong
                          ? { x: [5, -5, 5, -5, 0] }
                          : isMatched
                          ? { scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={{ duration: 0.4 }}
                      className={`flex w-full items-center justify-between rounded-2xl p-3 text-left font-bold shadow-sm ring-2 transition-all sm:p-4 ${
                        isMatched
                          ? "bg-rose-100 text-rose-700 ring-rose-300 opacity-60"
                          : isWrong
                          ? "bg-rose-50 text-rose-700 ring-rose-500"
                          : isSelected
                          ? "bg-rose-50 text-rose-700 ring-rose-500"
                          : "bg-white text-slate-700 ring-slate-100 hover:ring-rose-300"
                      }`}
                    >
                      <span className="text-sm sm:text-base">{item.text}</span>
                      {isMatched && <Check className="h-4 w-4 text-rose-500" />}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {currentQuestion.pairs.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    matchedPairs.has(idx.toString())
                      ? "bg-emerald-500 scale-125"
                      : "bg-slate-200"
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-500">
                {matchedPairs.size}/{currentQuestion.pairs.length} cocok
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Mascot
              mood={matchedPairs.size === currentQuestion.pairs.length ? "celebrating" : "thinking"}
              size={70}
              message={
                matchedPairs.size === currentQuestion.pairs.length
                  ? "Mantap! Semua cocok!"
                  : "Ayo cocokkan kata-katanya!"
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
