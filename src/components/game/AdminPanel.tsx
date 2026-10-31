"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock,
  KeyRound,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  LogOut,
  Home,
  ShieldCheck,
} from "lucide-react"
import { soundManager } from "@/lib/sound"

interface AccessCode {
  code: string
  createdAt: number
  usedBy: string | null
  usedAt: number | null
  deviceName: string | null
  note: string | null
}

const DEFAULT_ADMIN_PASSWORD = "rumbela-admin-2026"

export default function AdminPanel({ onExit }: { onExit: () => void }) {
  const [adminPassword, setAdminPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Cached admin password (stored in sessionStorage only, cleared on browser close)
  const [cachedPassword, setCachedPassword] = useState<string | null>(null)

  // Codes state
  const [codes, setCodes] = useState<AccessCode[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, used: 0 })
  const [loadingCodes, setLoadingCodes] = useState(false)

  // Generate form
  const [genCount, setGenCount] = useState(1)
  const [genNote, setGenNote] = useState("")
  const [generating, setGenerating] = useState(false)
  const [newCodes, setNewCodes] = useState<AccessCode[]>([])

  // Toast
  const [toast, setToast] = useState<string | null>(null)

  // Get cached password on mount
  useEffect(() => {
    const cached = sessionStorage.getItem("rumbela-admin-pw")
    if (cached) {
      setCachedPassword(cached)
      setAdminPassword(cached)
      // Try auto-login
      verifyLogin(cached)
    }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const verifyLogin = async (password: string): Promise<boolean> => {
    try {
      const r = await fetch("/api/admin/codes", {
        headers: { "x-admin-password": password },
      })
      if (r.status === 401) {
        setLoginError("Password admin salah.")
        soundManager.play("wrong")
        return false
      }
      if (!r.ok) {
        setLoginError("Server error. Coba lagi.")
        return false
      }
      // Login success
      setLoggedIn(true)
      setLoginError(null)
      sessionStorage.setItem("rumbela-admin-pw", password)
      soundManager.play("select")
      return true
    } catch {
      setLoginError("Gagal terhubung ke server.")
      return false
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminPassword.trim()) {
      setLoginError("Masukkan password admin.")
      return
    }
    await verifyLogin(adminPassword.trim())
  }

  const handleLogout = () => {
    sessionStorage.removeItem("rumbela-admin-pw")
    setLoggedIn(false)
    setAdminPassword("")
    setCachedPassword(null)
    setCodes([])
    soundManager.play("click")
  }

  const fetchCodes = useCallback(async () => {
    if (!cachedPassword) return
    setLoadingCodes(true)
    try {
      const r = await fetch("/api/admin/codes", {
        headers: { "x-admin-password": cachedPassword },
      })
      const data = await r.json()
      if (data.success) {
        setCodes(data.codes)
        setStats(data.stats)
      } else {
        showToast(data.message || "Gagal mengambil kode.")
      }
    } catch {
      showToast("Gagal terhubung ke server.")
    } finally {
      setLoadingCodes(false)
    }
  }, [cachedPassword])

  // Fetch codes when logged in
  useEffect(() => {
    if (loggedIn && cachedPassword) {
      fetchCodes()
    }
  }, [loggedIn, cachedPassword, fetchCodes])

  const handleGenerate = async () => {
    if (!cachedPassword) return
    setGenerating(true)
    setNewCodes([])
    try {
      const r = await fetch("/api/admin/codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": cachedPassword,
        },
        body: JSON.stringify({ count: genCount, note: genNote.trim() || undefined }),
      })
      const data = await r.json()
      if (data.success) {
        setNewCodes(data.codes)
        soundManager.play("achievement")
        showToast(`${data.codes.length} kode dibuat!`)
        fetchCodes()  // refresh list
        setGenNote("")
      } else {
        showToast(data.message || "Gagal membuat kode.")
        soundManager.play("wrong")
      }
    } catch {
      showToast("Gagal terhubung ke server.")
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (code: string, action: "delete" | "reset") => {
    if (!cachedPassword) return
    if (!confirm(action === "delete" ? `Hapus kode ${code}?` : `Reset akses device ${code}?`)) return
    try {
      const r = await fetch(`/api/admin/codes?code=${encodeURIComponent(code)}&action=${action}`, {
        method: "DELETE",
        headers: { "x-admin-password": cachedPassword },
      })
      const data = await r.json()
      if (data.success) {
        soundManager.play("click")
        showToast(data.message)
        fetchCodes()
      } else {
        showToast(data.message || "Gagal.")
      }
    } catch {
      showToast("Gagal terhubung.")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      soundManager.play("click")
      showToast("Kode disalin ke clipboard!")
    } catch {
      showToast("Gagal menyalin.")
    }
  }

  // ====== Login screen ======
  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/10"
            >
              <Lock className="h-7 w-7" />
            </motion.div>
            <h1 className="text-lg font-black uppercase tracking-wide">Admin Panel</h1>
            <p className="text-xs text-white/70">RUMBELA GAMES - Pengelola</p>
          </div>
          <div className="space-y-4 p-6">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Password Admin
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoFocus
                  className="w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#1cb0f6] focus:ring-2 focus:ring-[#1cb0f6]/20"
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 ring-1 ring-rose-200">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <p className="text-xs font-semibold text-rose-700">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#1e293b] active:translate-y-0.5 active:shadow-[0_2px_0_#1e293b] transition-all"
              >
                <ShieldCheck className="h-4 w-4" />
                Login Admin
              </button>
            </form>
            <button
              onClick={onExit}
              className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-200 transition-all"
            >
              ← Kembali ke Game
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ====== Admin dashboard ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-800 sm:text-2xl">
              🛡️ Admin Panel
            </h1>
            <p className="text-xs text-slate-500">
              RUMBELA GAMES - Manajemen Kode Akses
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 border-2 border-[#e5e5e5] shadow-[0_2px_0_#e5e5e5] hover:bg-slate-50 transition-all"
            >
              <Home className="h-3.5 w-3.5" />
              Game
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white border-2 border-rose-600 shadow-[0_2px_0_#c41818] hover:bg-rose-600 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </header>

        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-[#e5e5e5]">
            <p className="text-xs font-bold uppercase text-slate-500">Total Kode</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-[#e5e5e5]">
            <p className="text-xs font-bold uppercase text-slate-500">Belum Dipakai</p>
            <p className="text-2xl font-black text-emerald-600">{stats.active}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border-2 border-[#e5e5e5]">
            <p className="text-xs font-bold uppercase text-slate-500">Sudah Dipakai</p>
            <p className="text-2xl font-black text-amber-600">{stats.used}</p>
          </div>
        </div>

        {/* Generate codes section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm border-2 border-[#e5e5e5]"
        >
          <h2 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700">
            <Plus className="h-4 w-4 text-[#58cc02]" />
            Generate Kode Baru
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                Jumlah
              </label>
              <select
                value={genCount}
                onChange={(e) => setGenCount(parseInt(e.target.value))}
                className="rounded-lg border-2 border-[#e5e5e5] bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-[#1cb0f6]"
              >
                {[1, 2, 5, 10, 20].map((n) => (
                  <option key={n} value={n}>{n} kode</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                Catatan (opsional)
              </label>
              <input
                type="text"
                value={genNote}
                onChange={(e) => setGenNote(e.target.value)}
                placeholder="Misal: untuk Dina kelas 5A"
                maxLength={50}
                className="w-full rounded-lg border-2 border-[#e5e5e5] bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1cb0f6]"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 rounded-xl bg-[#58cc02] px-4 py-2 text-sm font-black uppercase tracking-wide text-white shadow-[0_3px_0_#58a700] border-2 border-[#58a700] active:translate-y-0.5 active:shadow-[0_1px_0_#58a700] disabled:opacity-50 transition-all"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate
            </button>
          </div>

          {/* New codes display */}
          <AnimatePresence>
            {newCodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200"
              >
                <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {newCodes.length} Kode Baru Dibuat - Copy & Share ke Siswa
                </p>
                <div className="space-y-1.5">
                  {newCodes.map((c) => (
                    <div
                      key={c.code}
                      className="flex items-center justify-between rounded-lg bg-white p-2"
                    >
                      <code className="font-mono text-sm font-black tracking-widest text-slate-800">
                        {c.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        className="flex items-center gap-1 rounded-md bg-[#1cb0f6] px-2 py-1 text-[10px] font-bold uppercase text-white hover:bg-[#1899d6] transition-all"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Codes list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white p-5 shadow-sm border-2 border-[#e5e5e5]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700">
              <KeyRound className="h-4 w-4 text-[#1cb0f6]" />
              Daftar Semua Kode
            </h2>
            <button
              onClick={fetchCodes}
              disabled={loadingCodes}
              className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className={`h-3 w-3 ${loadingCodes ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {codes.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">
                Belum ada kode. Generate kode baru di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {codes.map((c) => {
                const isUsed = !!c.usedBy
                return (
                  <motion.div
                    key={c.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-wrap items-center gap-2 rounded-xl p-3 border-2 ${
                      isUsed
                        ? "bg-amber-50 border-amber-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <code className="font-mono text-sm font-black tracking-widest text-slate-800">
                      {c.code}
                    </code>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                        isUsed
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {isUsed ? "Sudah Dipakai" : "Aktif"}
                    </span>
                    {c.note && (
                      <span className="text-[10px] italic text-slate-500">
                        📝 {c.note}
                      </span>
                    )}
                    {isUsed && c.deviceName && (
                      <span className="text-[10px] font-semibold text-slate-600">
                        👤 {c.deviceName}
                      </span>
                    )}
                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        className="rounded-md bg-[#1cb0f6] px-2 py-1 text-[10px] font-bold uppercase text-white hover:bg-[#1899d6] transition-all flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {isUsed && (
                        <button
                          onClick={() => handleRevoke(c.code, "reset")}
                          title="Reset akses device (kode bisa dipakai lagi)"
                          className="rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white hover:bg-amber-600 transition-all flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRevoke(c.code, "delete")}
                        title="Hapus kode permanen"
                        className="rounded-md bg-rose-500 px-2 py-1 text-[10px] font-bold uppercase text-white hover:bg-rose-600 transition-all flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-4 left-1/2 z-50 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { DEFAULT_ADMIN_PASSWORD }
