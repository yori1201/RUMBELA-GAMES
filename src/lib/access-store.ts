// ============================================================
// Access Store - Vercel KV wrapper for access code management
// Single-use codes that prevent unauthorized sharing
// ============================================================

import { Redis } from "@upstash/redis"

// Check if KV env vars are configured
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

// Lazy-init Redis client (only if env vars exist)
let redis: Redis | null = null
if (KV_URL && KV_TOKEN) {
  redis = new Redis({ url: KV_URL, token: KV_TOKEN })
}

export interface AccessCode {
  code: string
  createdAt: number
  usedBy: string | null  // device identifier
  usedAt: number | null
  deviceName: string | null  // name entered by user
  note: string | null  // admin note (e.g., "for Dina")
}

const CODES_KEY = "rumbela:access_codes"  // hash key in Redis

// Generate random code: format RMB-XXXX-XXXX (easy to type, hard to guess)
function generateRandomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  // no I, O, 0, 1 (confusing)
  const part = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `RMB-${part(4)}-${part(4)}`
}

// Check if KV is configured
export function isKVConfigured(): boolean {
  return redis !== null
}

// ============================================================
// User-facing: validate a code (single-use)
// ============================================================
export async function validateAndConsumeCode(
  code: string,
  deviceName: string,
  deviceFingerprint: string
): Promise<{ success: boolean; message: string; code?: AccessCode }> {
  if (!redis) {
    return {
      success: false,
      message: "Server belum dikonfigurasi. Hubungi admin Rumbela.",
    }
  }

  const normalized = code.trim().toUpperCase()
  if (!normalized) {
    return { success: false, message: "Kode tidak boleh kosong." }
  }

  // Get code from hash
  const codeData = (await redis.hget<AccessCode>(CODES_KEY, normalized)) as AccessCode | null

  if (!codeData) {
    return { success: false, message: "Kode tidak ditemukan. Periksa kembali." }
  }

  // Already used?
  if (codeData.usedBy) {
    return {
      success: false,
      message: "Kode sudah dipakai. Setiap kode hanya bisa digunakan 1 kali pada 1 device.",
    }
  }

  // Mark as used (consume)
  const updated: AccessCode = {
    ...codeData,
    usedBy: deviceFingerprint,
    usedAt: Date.now(),
    deviceName,
  }
  await redis.hset(CODES_KEY, { [normalized]: updated })

  return { success: true, message: "Akses berhasil! Selamat belajar 🎉", code: updated }
}

// ============================================================
// Admin: generate new codes
// ============================================================
export async function generateCodes(
  count: number,
  note?: string
): Promise<AccessCode[]> {
  if (!redis) {
    throw new Error("KV not configured")
  }

  const codes: AccessCode[] = []
  for (let i = 0; i < count; i++) {
    let code = generateRandomCode()
    // Ensure uniqueness
    while (await redis.hexists(CODES_KEY, code)) {
      code = generateRandomCode()
    }
    const entry: AccessCode = {
      code,
      createdAt: Date.now(),
      usedBy: null,
      usedAt: null,
      deviceName: null,
      note: note || null,
    }
    await redis.hset(CODES_KEY, { [code]: entry })
    codes.push(entry)
  }
  return codes
}

// ============================================================
// Admin: list all codes
// ============================================================
export async function listAllCodes(): Promise<AccessCode[]> {
  if (!redis) {
    return []
  }
  const all = (await redis.hgetall<AccessCode>(CODES_KEY)) as Record<string, AccessCode> | null
  if (!all) return []
  return Object.values(all).sort((a, b) => b.createdAt - a.createdAt)
}

// ============================================================
// Admin: revoke a code (delete)
// ============================================================
export async function revokeCode(code: string): Promise<boolean> {
  if (!redis) return false
  const normalized = code.trim().toUpperCase()
  await redis.hdel(CODES_KEY, normalized)
  return true
}

// ============================================================
// Admin: revoke device access (mark code as unused again)
// ============================================================
export async function revokeDeviceAccess(code: string): Promise<boolean> {
  if (!redis) return false
  const normalized = code.trim().toUpperCase()
  const codeData = (await redis.hget<AccessCode>(CODES_KEY, normalized)) as AccessCode | null
  if (!codeData) return false
  const reset: AccessCode = {
    ...codeData,
    usedBy: null,
    usedAt: null,
    deviceName: null,
  }
  await redis.hset(CODES_KEY, { [normalized]: reset })
  return true
}
