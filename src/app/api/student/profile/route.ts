// ============================================================
// RUMBELA GAMES — Student Profile API
// Phase 1 stub per PRD Section 12.1
//
// NOTE: This is a stub implementation. Real implementation needs:
// - Server-side session (HttpOnly cookie) — not localStorage
// - Prisma query to Student table (after db:push with new schema)
// - Authorization check (token must match student)
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import { isValidStageAndGrade } from "@/lib/curriculum-data"

const PROFILE_STORAGE_KEY = "rumbela-student-profile"

interface StudentProfile {
  accessIdentityId: string
  displayName: string
  educationStage: string
  gradeCode: string
  avatarKey?: string
  onboardedAt: string
  updatedAt: string
}

// GET /api/student/profile
// Returns profile for the current session.
// Phase 1: read from localStorage via X-Device-Token header (fallback)
// Phase 2+: read from Prisma via session cookie
export async function GET(request: NextRequest) {
  // Phase 1 stub: client sends device token via header
  // (transitional pattern — PRD requires HttpOnly cookie, deferred to Phase 2)
  const deviceToken = request.headers.get("x-device-token")
  if (!deviceToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  // TODO Phase 2: query Prisma Student by accessIdentityId
  // For now, return 404 to signal client that onboarding is needed
  // (Real check: if access token valid but no Student record exists)
  return NextResponse.json({
    success: true,
    profile: null, // null = not yet onboarded
    message: "Profile not yet created. Onboarding required.",
  })
}

// PUT /api/student/profile
// Create or update student profile (after onboarding form submission)
export async function PUT(request: NextRequest) {
  const deviceToken = request.headers.get("x-device-token")
  if (!deviceToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  let body: {
    displayName?: string
    educationStage?: string
    gradeCode?: string
    avatarKey?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const { displayName, educationStage, gradeCode, avatarKey } = body

  // Validate required fields per PRD Section 5.2
  if (!displayName || !displayName.trim()) {
    return NextResponse.json(
      { success: false, message: "Nama panggilan wajib diisi" },
      { status: 422 }
    )
  }
  if (!educationStage || !gradeCode) {
    return NextResponse.json(
      { success: false, message: "Jenjang dan kelas wajib diisi" },
      { status: 422 }
    )
  }
  if (!isValidStageAndGrade(educationStage, gradeCode)) {
    return NextResponse.json(
      { success: false, message: "Kombinasi jenjang/kelas tidak valid" },
      { status: 422 }
    )
  }
  if (displayName.trim().length > 30) {
    return NextResponse.json(
      { success: false, message: "Nama panggilan maksimal 30 karakter" },
      { status: 422 }
    )
  }

  // TODO Phase 2: upsert Student record in Prisma
  // const student = await prisma.student.upsert({
  //   where: { accessIdentityId: deviceToken },
  //   create: { ... },
  //   update: { displayName, educationStage, gradeCode, avatarKey },
  // })

  const profile: StudentProfile = {
    accessIdentityId: deviceToken,
    displayName: displayName.trim(),
    educationStage,
    gradeCode,
    avatarKey,
    onboardedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Phase 1 transitional: store in localStorage via response
  // Client will persist this. Phase 2 will replace with server session.
  return NextResponse.json({
    success: true,
    profile,
    // Signal to client to persist locally for transitional Phase 1
    persistLocally: true,
    storageKey: PROFILE_STORAGE_KEY,
  })
}
