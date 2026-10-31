// ============================================================
// API: /api/admin/codes - Admin manages access codes
// POST: generate new codes (requires admin password)
// GET: list all codes (requires admin password)
// DELETE: revoke a code (requires admin password)
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import {
  generateCodes,
  listAllCodes,
  revokeCode,
  revokeDeviceAccess,
  isKVConfigured,
} from "@/lib/access-store"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rumbela-admin-2026"

// Verify admin password from header
function verifyAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("x-admin-password")
  if (!auth) return false
  // Constant-time comparison (basic)
  if (auth.length !== ADMIN_PASSWORD.length) return false
  let diff = 0
  for (let i = 0; i < auth.length; i++) {
    diff |= auth.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i)
  }
  return diff === 0
}

// POST: generate codes
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, message: "Password admin salah." },
        { status: 401 }
      )
    }

    if (!isKVConfigured()) {
      return NextResponse.json(
        { success: false, message: "KV belum dikonfigurasi. Setup dulu di Vercel." },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const count = Math.min(Math.max(parseInt(body.count) || 1, 1), 50)  // 1-50 codes
    const note = body.note || undefined

    const codes = await generateCodes(count, note)

    return NextResponse.json({
      success: true,
      codes,
      message: `${codes.length} kode berhasil dibuat.`,
    })
  } catch (error) {
    console.error("Generate codes error:", error)
    return NextResponse.json(
      { success: false, message: "Gagal membuat kode." },
      { status: 500 }
    )
  }
}

// GET: list all codes
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, message: "Password admin salah." },
        { status: 401 }
      )
    }

    if (!isKVConfigured()) {
      return NextResponse.json(
        { success: false, message: "KV belum dikonfigurasi." },
        { status: 503 }
      )
    }

    const codes = await listAllCodes()
    return NextResponse.json({
      success: true,
      codes,
      stats: {
        total: codes.length,
        active: codes.filter((c) => !c.usedBy).length,
        used: codes.filter((c) => c.usedBy).length,
      },
    })
  } catch (error) {
    console.error("List codes error:", error)
    return NextResponse.json(
      { success: false, message: "Gagal mengambil daftar kode." },
      { status: 500 }
    )
  }
}

// DELETE: revoke code
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, message: "Password admin salah." },
        { status: 401 }
      )
    }

    if (!isKVConfigured()) {
      return NextResponse.json(
        { success: false, message: "KV belum dikonfigurasi." },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const action = searchParams.get("action")  // "delete" or "reset"

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Code parameter wajib." },
        { status: 400 }
      )
    }

    if (action === "reset") {
      // Reset device access (allow code to be used again)
      await revokeDeviceAccess(code)
      return NextResponse.json({
        success: true,
        message: "Akses device direset. Kode bisa dipakai lagi.",
      })
    } else {
      // Delete code entirely
      await revokeCode(code)
      return NextResponse.json({
        success: true,
        message: "Kode berhasil dihapus.",
      })
    }
  } catch (error) {
    console.error("Revoke code error:", error)
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kode." },
      { status: 500 }
    )
  }
}
