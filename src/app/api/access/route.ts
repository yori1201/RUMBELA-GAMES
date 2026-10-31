// ============================================================
// API: /api/access - User validates access code
// POST: validate code + register device
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import { validateAndConsumeCode, isKVConfigured } from "@/lib/access-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, deviceName } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Kode akses wajib diisi." },
        { status: 400 }
      )
    }

    if (!deviceName || typeof deviceName !== "string" || deviceName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Nama kamu wajib diisi (minimal 2 huruf)." },
        { status: 400 }
      )
    }

    // Check KV config
    if (!isKVConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Server belum dikonfigurasi. Hubungi admin Rumbela.",
          kvNotConfigured: true,
        },
        { status: 503 }
      )
    }

    // Generate device fingerprint from request headers + IP
    const userAgent = request.headers.get("user-agent") || "unknown"
    const acceptLang = request.headers.get("accept-language") || ""
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const deviceFingerprint = `${ip}::${userAgent.slice(0, 50)}::${acceptLang.slice(0, 10)}`

    const result = await validateAndConsumeCode(code, deviceName.trim(), deviceFingerprint)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      deviceToken: code.trim().toUpperCase(),
      deviceName: deviceName.trim(),
    })
  } catch (error) {
    console.error("Access validation error:", error)
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan. Coba lagi." },
      { status: 500 }
    )
  }
}

// GET: check if KV is configured (for client-side fallback)
export async function GET() {
  return NextResponse.json({
    kvConfigured: isKVConfigured(),
  })
}
