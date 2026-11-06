// ============================================================
// RUMBELA GAMES — Student Dashboard API
// Phase 1 stub per PRD Section 12.1
//
// Returns dashboard summary: profile, available subjects,
// progress summary (placeholder until Phase 3 adaptive engine).
// ============================================================

import { NextRequest, NextResponse } from "next/server"
import { SUBJECTS, getEnabledSubjects } from "@/lib/curriculum-data"

export async function GET(request: NextRequest) {
  const deviceToken = request.headers.get("x-device-token")
  if (!deviceToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  // TODO Phase 2: query Student + StudentCompetencyProgress + recent GameSession
  // For now, return subject catalog only — progress summary is null

  return NextResponse.json({
    success: true,
    dashboard: {
      subjects: SUBJECTS.map((s) => ({
        code: s.code,
        name: s.name,
        emoji: s.emoji,
        description: s.description,
        gradient: s.gradient,
        enabled: s.enabled,
        comingSoonLabel: s.comingSoonLabel,
        // TODO Phase 3: populate from StudentCompetencyProgress
        progress: null,
        lastPlayedAt: null,
        recommendedLevelId: null,
      })),
      // TODO Phase 3: adaptive engine recommendation
      recommendedNextAction: null,
    },
  })
}
