"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, KeyRound, Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { soundManager } from "@/lib/sound"

interface AccessGateProps {
  onAccessGranted: (deviceToken: string, deviceName: string) => void
}

const STORAGE_KEY = "rumbela-access-token"
const STORAGE_NAME = "rumbela-device-name"

export default function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [kvConfigured, setKvConfigured] = useState<boolean | null>(null)

  // Check KV config on mount
  useEffect(() => {
    fetch("/api/access")
      .then((r) => r.json())
      .then((data) => setKvConfigured(data.kvConfigured === true))
      .catch(() => setKvConfigured(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setError(null)
    setSuccess(null)

    if (code.trim().length < 5) {
      setError("Kode akses minimal 5 karakter.")
      soundManager.play("wrong")
      return
    }
    if (name.trim().length < 2) {
      setError("Nama minimal 2 huruf.")
      soundManager.play("wrong")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), deviceName: name.trim() }),
      })
      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || "Akses berhasil!")
        soundManager.play("win")

        // Store device token in localStorage
        localStorage.setItem(STORAGE_KEY, data.deviceToken)
        localStorage.setItem(STORAGE_NAME, data.deviceName)

        // Wait 1.2s for celebration, then call onAccessGranted
        setTimeout(() => {
          onAccessGranted(data.deviceToken, data.deviceName)
        }, 1200)
      } else {
        setError(data.message || "Kode salah atau sudah dipakai.")
        soundManager.play("wrong")
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Coba lagi.")
      soundManager.play("wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#58cc02] via-[#1cb0f6] to-[#ce82ff]">
      {/* Decorative floating letters in background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {["R", "U", "M", "B", "E", "L", "A"].map((letter, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl font-black text-white/10 sm:text-8xl"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {letter}
          </motion.div>
        ))}
      </div>

      {/* Main card */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header with logo */}
          <div className="bg-gradient-to-br from-[#58cc02] to-[#1cb0f6] p-6 text-center text-white">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              src="/rumbela/logo-full.png"
              alt="Rumbela"
              className="mx-auto mb-2 h-20 w-auto drop-shadow-lg"
              draggable={false}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
            >
              <Lock className="h-3 w-3" />
              Area Privat - Butuh Kode Akses
            </motion.div>
          </div>

          {/* Body */}
          <div className="space-y-4 p-6">
            {/* KV not configured warning */}
            {kvConfigured === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200"
              >
                <p className="text-xs font-bold text-amber-700">
                  ⚠️ Server belum dikonfigurasi
                </p>
                <p className="mt-1 text-[10px] text-amber-600">
                  Admin Rumbela perlu setup Vercel KV terlebih dahulu.
                  Hubungi admin untuk informasi.
                </p>
              </motion.div>
            )}

            <div className="text-center">
              <h1 className="text-lg font-black text-slate-800">
                Selamat Datang di Rumbela! 🌱
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Game ini privat. Masukkan kode akses yang kamu dapat dari
                pengelola bimbel Rumbela.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name input */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Dina"
                  maxLength={30}
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-all focus:border-[#1cb0f6] focus:ring-2 focus:ring-[#1cb0f6]/20 disabled:bg-slate-50"
                  autoComplete="off"
                />
              </div>

              {/* Code input */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Kode Akses
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="RMB-XXXX-XXXX"
                    maxLength={20}
                    disabled={loading}
                    className="w-full rounded-xl border-2 border-[#e5e5e5] bg-white py-3 pl-10 pr-4 text-sm font-black uppercase tracking-widest text-slate-800 outline-none transition-all focus:border-[#1cb0f6] focus:ring-2 focus:ring-[#1cb0f6]/20 disabled:bg-slate-50"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200"
                  >
                    <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <p className="text-xs font-semibold text-rose-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#58cc02] py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#58a700] border-2 border-[#58a700] active:translate-y-0.5 active:shadow-[0_2px_0_#58a700] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Buka Akses
                  </>
                )}
              </motion.button>
            </form>

            {/* Info note */}
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-semibold text-slate-500">
                💡 <strong>Cara dapat kode:</strong> Minta langsung ke pengelola
                bimbel Rumbela. Kode hanya berlaku untuk 1 device dan 1x pakai.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-[10px] font-semibold text-white/70">
          © {new Date().getFullYear()} Rumbela · Rumah belajar Anak
        </p>
      </div>
    </div>
  )
}

// Helper to check if user already has access (call from parent)
export function checkExistingAccess(): { token: string; name: string } | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(STORAGE_KEY)
  const name = localStorage.getItem(STORAGE_NAME)
  if (token && name) return { token, name }
  return null
}

// Helper to clear access (logout)
export function clearAccess() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_NAME)
}
