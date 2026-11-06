"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react"
import {
  STAGES,
  getEnabledStages,
  type EducationStage,
  type GradeOption,
} from "@/lib/curriculum-data"
import { soundManager } from "@/lib/sound"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Mascot from "./Mascot"

interface OnboardingScreenProps {
  defaultName: string
  onComplete: (profile: {
    displayName: string
    educationStage: EducationStage
    gradeCode: string
  }) => void
  onCancel: () => void
}

type Step = "name" | "stage" | "grade" | "confirm"

export default function OnboardingScreen({
  defaultName,
  onComplete,
  onCancel,
}: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>("name")
  const [name, setName] = useState(defaultName || "")
  const [stage, setStage] = useState<EducationStage | null>(null)
  const [gradeCode, setGradeCode] = useState<string | null>(null)

  const enabledStages = getEnabledStages()
  const selectedStage = stage ? STAGES.find((s) => s.stage === stage) : null
  const selectedGrade =
    selectedStage && gradeCode
      ? selectedStage.grades.find((g) => g.code === gradeCode)
      : null

  const canProceed = () => {
    if (step === "name") return name.trim().length >= 2
    if (step === "stage") return !!stage
    if (step === "grade") return !!gradeCode
    if (step === "confirm") return true
    return false
  }

  const handleNext = () => {
    if (!canProceed()) {
      soundManager.play("wrong")
      return
    }
    soundManager.play("select")
    if (step === "name") setStep("stage")
    else if (step === "stage") setStep("grade")
    else if (step === "grade") setStep("confirm")
    else if (step === "confirm") {
      onComplete({
        displayName: name.trim(),
        educationStage: stage!,
        gradeCode: gradeCode!,
      })
    }
  }

  const handleBack = () => {
    soundManager.play("click")
    if (step === "stage") setStep("name")
    else if (step === "grade") setStep("stage")
    else if (step === "confirm") setStep("grade")
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header with progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {(["name", "stage", "grade", "confirm"] as Step[]).map((s, idx) => {
            const isActive = step === s
            const isPast =
              ["name", "stage", "grade", "confirm"].indexOf(step) > idx
            return (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  isActive
                    ? "w-8 bg-emerald-500"
                    : isPast
                    ? "w-2 bg-emerald-400"
                    : "w-2 bg-slate-200"
                }`}
              />
            )
          })}
        </div>

        {/* Mascot greeting */}
        <div className="mb-6 flex justify-center">
          <Mascot
            mood="happy"
            size={100}
            message="Halo! Aku Bela. Yuk kenalan dulu!"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Name */}
          {step === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
            >
              <h2 className="mb-2 text-center text-2xl font-black text-slate-800">
                Siapa namamu? ✨
              </h2>
              <p className="mb-4 text-center text-sm text-slate-500">
                Pakai nama panggilanmu ya, biar Bela bisa sapamu
              </p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dina, Budi, Sari..."
                maxLength={30}
                autoFocus
                className="h-14 rounded-2xl text-center text-lg font-bold"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext()
                }}
              />
            </motion.div>
          )}

          {/* STEP 2: Education Stage */}
          {step === "stage" && (
            <motion.div
              key="stage"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
            >
              <h2 className="mb-2 text-center text-2xl font-black text-slate-800">
                Jenjang mana, {name}? 📚
              </h2>
              <p className="mb-4 text-center text-sm text-slate-500">
                Pilih jenjang sekolahmu
              </p>
              <div className="grid grid-cols-2 gap-3">
                {enabledStages.map((s) => (
                  <motion.button
                    key={s.stage}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundManager.play("click")
                      setStage(s.stage)
                      setGradeCode(null)
                    }}
                    className={`relative overflow-hidden rounded-2xl p-4 text-left shadow-md ring-2 transition-all ${
                      stage === s.stage
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 ring-emerald-500"
                        : "bg-white ring-slate-200 hover:ring-emerald-300"
                    }`}
                  >
                    <div className="text-3xl">{s.emoji}</div>
                    <h3
                      className={`mt-2 text-lg font-black ${
                        stage === s.stage ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {s.label}
                    </h3>
                    <p
                      className={`text-xs ${
                        stage === s.stage ? "text-white/90" : "text-slate-500"
                      }`}
                    >
                      {s.description}
                    </p>
                    {stage === s.stage && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white"
                      >
                        <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Grade */}
          {step === "grade" && selectedStage && (
            <motion.div
              key="grade"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
            >
              <h2 className="mb-2 text-center text-2xl font-black text-slate-800">
                Kelas berapa? 🎒
              </h2>
              <p className="mb-4 text-center text-sm text-slate-500">
                {selectedStage.label} — pilih kelasmu
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {selectedStage.grades.map((g: GradeOption) => (
                  <motion.button
                    key={g.code}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundManager.play("click")
                      setGradeCode(g.code)
                    }}
                    className={`rounded-2xl p-4 text-center font-bold shadow-md ring-2 transition-all ${
                      gradeCode === g.code
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white ring-emerald-500"
                        : "bg-white text-slate-700 ring-slate-200 hover:ring-emerald-300"
                    }`}
                  >
                    {g.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirm */}
          {step === "confirm" && selectedStage && selectedGrade && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-xl ring-1 ring-emerald-100"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-3xl shadow-lg">
                  {selectedStage.emoji}
                </div>
              </div>
              <h2 className="mb-4 text-center text-2xl font-black text-slate-800">
                Halo, {name}! 👋
              </h2>
              <div className="space-y-2 rounded-2xl bg-white/70 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama panggilan:</span>
                  <span className="font-bold text-slate-800">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenjang:</span>
                  <span className="font-bold text-slate-800">
                    {selectedStage.emoji} {selectedStage.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas:</span>
                  <span className="font-bold text-slate-800">
                    {selectedGrade.label}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Kamu bisa ubah ini nanti di pengaturan profil
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          {step !== "name" && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-14 rounded-2xl px-6 font-bold"
            >
              <ArrowLeft className="mr-1 h-5 w-5" />
              Kembali
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`h-14 flex-1 rounded-2xl text-base font-black shadow-lg transition-all ${
              canProceed()
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 active:scale-98"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {step === "confirm" ? (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> Mulai Belajar!
              </>
            ) : (
              <>
                Lanjut <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Skip / Cancel */}
        <div className="mt-4 text-center">
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-rose-500"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
