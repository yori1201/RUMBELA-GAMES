// ============================================================
// RUMBELA GAMES — Curriculum data untuk onboarding siswa
// PRD Section 5.2: jenjang & kelas options
// ============================================================

export type EducationStage = "PAUD" | "TK" | "SD" | "SMP" | "SMA"

export interface GradeOption {
  code: string // TK_A, SD_1, SMP_7, etc
  label: string // "TK A", "Kelas 1 SD", etc
}

export interface StageOption {
  stage: EducationStage
  label: string
  emoji: string
  description: string
  grades: GradeOption[]
  enabled: boolean // false = hide from onboarding (e.g. SMA in MVP)
}

// PRD Section 5.2:
// - TK: TK A, TK B
// - PAUD: kelompok usia/kelas yang ditentukan admin
// - SD: kelas 1-6
// - SMP: kelas 7-9
// - SMA: kelas 10-12 (future-ready, disabled in MVP)
export const STAGES: StageOption[] = [
  {
    stage: "PAUD",
    label: "PAUD",
    emoji: "🧸",
    description: "Kelompok bermain usia dini",
    enabled: true,
    grades: [
      { code: "PAUD_A", label: "Kelompok Bermain A" },
      { code: "PAUD_B", label: "Kelompok Bermain B" },
    ],
  },
  {
    stage: "TK",
    label: "TK",
    emoji: "🎈",
    description: "Taman Kanak-Kanak",
    enabled: true,
    grades: [
      { code: "TK_A", label: "TK A" },
      { code: "TK_B", label: "TK B" },
    ],
  },
  {
    stage: "SD",
    label: "SD",
    emoji: "📚",
    description: "Sekolah Dasar (Kelas 1-6)",
    enabled: true,
    grades: [
      { code: "SD_1", label: "Kelas 1 SD" },
      { code: "SD_2", label: "Kelas 2 SD" },
      { code: "SD_3", label: "Kelas 3 SD" },
      { code: "SD_4", label: "Kelas 4 SD" },
      { code: "SD_5", label: "Kelas 5 SD" },
      { code: "SD_6", label: "Kelas 6 SD" },
    ],
  },
  {
    stage: "SMP",
    label: "SMP",
    emoji: "🎓",
    description: "Sekolah Menengah Pertama (Kelas 7-9)",
    enabled: true,
    grades: [
      { code: "SMP_7", label: "Kelas 7 SMP" },
      { code: "SMP_8", label: "Kelas 8 SMP" },
      { code: "SMP_9", label: "Kelas 9 SMP" },
    ],
  },
  {
    stage: "SMA",
    label: "SMA",
    emoji: "🏫",
    description: "Sekolah Menengah Atas — segera hadir",
    enabled: false, // PRD: future-ready, disable in MVP
    grades: [
      { code: "SMA_10", label: "Kelas 10 SMA" },
      { code: "SMA_11", label: "Kelas 11 SMA" },
      { code: "SMA_12", label: "Kelas 12 SMA" },
    ],
  },
]

export function getEnabledStages(): StageOption[] {
  return STAGES.filter((s) => s.enabled)
}

export function getStageByCode(stage: EducationStage): StageOption | undefined {
  return STAGES.find((s) => s.stage === stage)
}

export function getGradeByCode(stage: EducationStage, gradeCode: string): GradeOption | undefined {
  const stageOpt = getStageByCode(stage)
  return stageOpt?.grades.find((g) => g.code === gradeCode)
}

export function isValidStageAndGrade(stage: string, gradeCode: string): boolean {
  return !!getGradeByCode(stage as EducationStage, gradeCode)
}

// ============================================================
// SUBJECTS — PRD Section 5.3 dashboard cards
// ============================================================

export type SubjectCode = "MATH" | "ENGLISH" | "LOGIC"

export interface SubjectInfo {
  code: SubjectCode
  name: string
  emoji: string
  description: string
  gradient: string
  enabled: boolean // LOGIC disabled in MVP per PRD Section 19 P1
  comingSoonLabel?: string
}

export const SUBJECTS: SubjectInfo[] = [
  {
    code: "MATH",
    name: "Matematika",
    emoji: "🧮",
    description: "Berhitung, operasi, pola, dan pemecahan masalah",
    gradient: "from-rose-400 via-orange-400 to-amber-400",
    enabled: true,
  },
  {
    code: "ENGLISH",
    name: "English",
    emoji: "🇬🇧",
    description: "Vocabulary, Grammar, Conversation, dan Spelling",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    enabled: true,
  },
  {
    code: "LOGIC",
    name: "Coding / Logic",
    emoji: "🧩",
    description: "Sequencing, pola, debugging, dan computational thinking",
    gradient: "from-indigo-400 via-purple-400 to-violet-400",
    enabled: false,
    comingSoonLabel: "Segera hadir",
  },
]

export function getEnabledSubjects(): SubjectInfo[] {
  return SUBJECTS.filter((s) => s.enabled)
}

export function getSubjectByCode(code: SubjectCode): SubjectInfo | undefined {
  return SUBJECTS.find((s) => s.code === code)
}
