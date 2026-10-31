// ============================================================
// Rumbela Math Quest - Data Soal Berhitung
// 3 Level: TK/PAUD, SD, SMP
// Tipe soal:
//   - "number-recognition": Dengar angka → klik bubble yang benar
//   - "count-objects": Hitung benda → ketik/klik angka
//   - "arithmetic": Operasi + - × ÷ → klik jawaban benar
//   - "comparison": Pilih mana yang lebih besar/kecil
//   - "sequence": Lanjutkan pola angka
// ============================================================

export type MathLevel = "tk" | "sd" | "smp"
export type MathQuestionType =
  | "number-recognition" // Dengar angka → klik bubble angka yang benar
  | "count-objects"      // Hitung benda → pilih angka
  | "arithmetic"         // + - × ÷ → pilih jawaban
  | "comparison"         // Lebih besar / lebih kecil
  | "sequence"           // Lanjutkan pola angka

export interface MathQuestion {
  id: string
  level: MathLevel
  type: MathQuestionType
  // Soal yang ditampilkan / diucapkan
  prompt: string
  promptSpeech: string // teks yang akan diucapkan TTS (bisa beda dari prompt visual)
  // Untuk number-recognition: angka yang harus diklik
  // Untuk arithmetic: hasil operasi
  // Untuk count-objects: jumlah benda
  answer: number
  // Osi bubble (untuk mode klik)
  options: number[]
  // Untuk count-objects: benda yang ditampilkan (emoji)
  objects?: string[]
  // Poin
  points: number
  // Hint visual
  hint?: string
}

// Helper untuk random integer dalam range [min, max]
function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Acak array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate opsi angka yang unik, termasuk jawaban benar
function generateOptions(answer: number, count: number, range: [number, number]): number[] {
  const opts = new Set<number>([answer])
  let attempts = 0
  while (opts.size < count && attempts < 50) {
    const candidate = ri(range[0], range[1])
    if (candidate !== answer) opts.add(candidate)
    attempts++
  }
  // Fallback kalau range kekecilan
  let fallback = range[1] + 1
  while (opts.size < count) {
    if (!opts.has(fallback)) opts.add(fallback)
    fallback++
  }
  return shuffle([...opts])
}

// Benda untuk count-objects (TK)
const TK_OBJECTS = ["🍎", "🍌", "🌟", "🎈", "🐱", "🌸", "🦋", "🐟", "🍒", "🍦"]

// ============================================================
// GENERATOR FUNGSI (dinamis supaya setiap sesi beda)
// ============================================================

function genTKQuestions(count: number): MathQuestion[] {
  const qs: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    const variant = i % 4
    if (variant === 0) {
      // Number recognition 1-10
      const ans = ri(1, 10)
      qs.push({
        id: `tk-nr-${i}`,
        level: "tk",
        type: "number-recognition",
        prompt: "Pecahkan balon angka yang disebutkan!",
        promptSpeech: `Cari angka ${ans}`,
        answer: ans,
        options: generateOptions(ans, 6, [1, 10]),
        points: 10,
        hint: `Dengar dan cari angka ${ans}`,
      })
    } else if (variant === 1) {
      // Count objects 1-5
      const n = ri(1, 5)
      const obj = TK_OBJECTS[ri(0, TK_OBJECTS.length - 1)]
      qs.push({
        id: `tk-co-${i}`,
        level: "tk",
        type: "count-objects",
        prompt: `Hitung berapa ${obj} yang muncul!`,
        promptSpeech: `Hitung berapa ${obj} yang kamu lihat`,
        answer: n,
        options: generateOptions(n, 4, [1, 6]),
        objects: Array(n).fill(obj),
        points: 12,
        hint: `Hitung satu per satu`,
      })
    } else if (variant === 2) {
      // Number recognition 1-20 (lebih challenging)
      const ans = ri(11, 20)
      qs.push({
        id: `tk-nr2-${i}`,
        level: "tk",
        type: "number-recognition",
        prompt: "Pecahkan balon angka yang disebutkan!",
        promptSpeech: `Cari angka ${ans}`,
        answer: ans,
        options: generateOptions(ans, 6, [11, 20]),
        points: 15,
        hint: `Angka antara 11 dan 20`,
      })
    } else {
      // Sequence: 1, 2, 3, ? (lanjut pola)
      const start = ri(1, 5)
      const next = start + 1
      qs.push({
        id: `tk-seq-${i}`,
        level: "tk",
        type: "sequence",
        prompt: `Lanjutkan angka berikutnya! ${start}, ${next}, ... ?`,
        promptSpeech: `Setelah ${start} dan ${next}, angka berapa yang datang?`,
        answer: next + 1,
        options: generateOptions(next + 1, 4, [1, 10]),
        points: 15,
        hint: `Hitung satu lebih dari ${next}`,
      })
    }
  }
  return qs
}

function genSDQuestions(count: number): MathQuestion[] {
  const qs: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    const variant = i % 5
    if (variant === 0) {
      // Penjumlahan 2 digit
      const a = ri(10, 50)
      const b = ri(5, 30)
      const ans = a + b
      qs.push({
        id: `sd-add-${i}`,
        level: "sd",
        type: "arithmetic",
        prompt: `${a} + ${b} = ?`,
        promptSpeech: `Berapa ${a} ditambah ${b}?`,
        answer: ans,
        options: generateOptions(ans, 4, [ans - 10, ans + 15]),
        points: 20,
        hint: `Hitung bertahap`,
      })
    } else if (variant === 1) {
      // Pengurangan
      const a = ri(20, 80)
      const b = ri(5, a - 1)
      const ans = a - b
      qs.push({
        id: `sd-sub-${i}`,
        level: "sd",
        type: "arithmetic",
        prompt: `${a} − ${b} = ?`,
        promptSpeech: `Berapa ${a} dikurang ${b}?`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(0, ans - 10), ans + 15]),
        points: 20,
        hint: `Hitung mundur`,
      })
    } else if (variant === 2) {
      // Perkalian kecil
      const a = ri(2, 9)
      const b = ri(2, 9)
      const ans = a * b
      qs.push({
        id: `sd-mul-${i}`,
        level: "sd",
        type: "arithmetic",
        prompt: `${a} × ${b} = ?`,
        promptSpeech: `Berapa ${a} kali ${b}?`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(1, ans - 10), ans + 15]),
        points: 25,
        hint: `Hitung berulang`,
      })
    } else if (variant === 3) {
      // Comparison: mana yang lebih besar?
      const a = ri(100, 999)
      const b = ri(100, 999)
      const bigger = Math.max(a, b)
      qs.push({
        id: `sd-cmp-${i}`,
        level: "sd",
        type: "comparison",
        prompt: `Mana yang LEBIH BESAR?`,
        promptSpeech: `Mana yang lebih besar? ${a} atau ${b}?`,
        answer: bigger,
        options: shuffle([a, b]),
        points: 18,
        hint: `Bandingkan angka dari kiri`,
      })
    } else {
      // Sequence kelipatan
      const step = ri(2, 5)
      const start = ri(2, 10)
      const a = start
      const b = start + step
      const c = start + step * 2
      const next = start + step * 3
      qs.push({
        id: `sd-seq-${i}`,
        level: "sd",
        type: "sequence",
        prompt: `Lanjutkan pola: ${a}, ${b}, ${c}, ... ?`,
        promptSpeech: `Setelah ${a}, ${b}, ${c}, angka berapa berikutnya?`,
        answer: next,
        options: generateOptions(next, 4, [next - 5, next + 10]),
        points: 22,
        hint: `Selisih tiap angka adalah ${step}`,
      })
    }
  }
  return qs
}

function genSMPQuestions(count: number): MathQuestion[] {
  const qs: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    const variant = i % 5
    if (variant === 0) {
      // Perkalian 2 digit
      const a = ri(11, 25)
      const b = ri(5, 15)
      const ans = a * b
      qs.push({
        id: `smp-mul-${i}`,
        level: "smp",
        type: "arithmetic",
        prompt: `${a} × ${b} = ?`,
        promptSpeech: `Berapa ${a} kali ${b}?`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(1, ans - 25), ans + 30]),
        points: 30,
        hint: `Pecah jadi puluhan dan satuan`,
      })
    } else if (variant === 1) {
      // Pembagian (hasil bulat)
      const b = ri(2, 12)
      const q = ri(5, 20)
      const a = b * q // habis dibagi
      const ans = q
      qs.push({
        id: `smp-div-${i}`,
        level: "smp",
        type: "arithmetic",
        prompt: `${a} ÷ ${b} = ?`,
        promptSpeech: `Berapa ${a} dibagi ${b}?`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(1, ans - 8), ans + 12]),
        points: 30,
        hint: `Cari berapa kali ${b} dalam ${a}`,
      })
    } else if (variant === 2) {
      // Campuran: a + b × c (urutan operasi)
      const b = ri(2, 9)
      const c = ri(2, 9)
      const a = ri(10, 30)
      const ans = a + b * c // perkalian dulu
      qs.push({
        id: `smp-mix-${i}`,
        level: "smp",
        type: "arithmetic",
        prompt: `${a} + ${b} × ${c} = ?`,
        promptSpeech: `Berapa ${a} ditambah ${b} kali ${c}? Ingat, perkalian dulu!`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(1, ans - 20), ans + 25]),
        points: 35,
        hint: `Kerjakan ${b} × ${c} dulu, lalu tambah ${a}`,
      })
    } else if (variant === 3) {
      // Persentase
      const p = ri(10, 50)
      const base = (ri(2, 10)) * 100 // 200, 300, ... 1000
      const ans = (p * base) / 100
      qs.push({
        id: `smp-pct-${i}`,
        level: "smp",
        type: "arithmetic",
        prompt: `${p}% dari ${base} = ?`,
        promptSpeech: `Berapa ${p} persen dari ${base}?`,
        answer: ans,
        options: generateOptions(ans, 4, [Math.max(1, ans - 30), ans + 40]),
        points: 35,
        hint: `${p}% = ${p}/100, kalikan dengan ${base}`,
      })
    } else {
      // FPB / KPK concept: sequence kelipatan
      const step = ri(3, 9)
      const start = step
      const a = start
      const b = start * 2
      const c = start * 3
      const next = start * 4
      qs.push({
        id: `smp-seq-${i}`,
        level: "smp",
        type: "sequence",
        prompt: `Lanjutkan kelipatan: ${a}, ${b}, ${c}, ... ?`,
        promptSpeech: `Setelah ${a}, ${b}, ${c}, angka berapa berikutnya?`,
        answer: next,
        options: generateOptions(next, 4, [next - 10, next + 15]),
        points: 28,
        hint: `Ini kelipatan ${step}`,
      })
    }
  }
  return qs
}

// ============================================================
// API
// ============================================================

export interface MathLevelInfo {
  id: MathLevel
  name: string
  shortName: string
  icon: string
  description: string
  color: string
  gradient: string
  questionCount: number
  timePerQuestion: number // detif
  maxLives: number
  emoji: string
}

export const MATH_LEVELS: MathLevelInfo[] = [
  {
    id: "tk",
    name: "TK / PAUD",
    shortName: "TK",
    icon: "🎈",
    description: "Berhitung 1-20, kenal angka, hitung benda lucu",
    color: "rose",
    gradient: "from-pink-400 via-rose-400 to-red-400",
    questionCount: 8,
    timePerQuestion: 25,
    maxLives: 5,
    emoji: "🧸",
  },
  {
    id: "sd",
    name: "SD",
    shortName: "SD",
    icon: "✏️",
    description: "Tambah, kurang, kali, bandingkan angka 3 digit",
    color: "amber",
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    questionCount: 8,
    timePerQuestion: 22,
    maxLives: 4,
    emoji: "📚",
  },
  {
    id: "smp",
    name: "SMP",
    shortName: "SMP",
    icon: "🧮",
    description: "Perkalian 2 digit, pembagian, persen, urutan operasi",
    color: "indigo",
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
    questionCount: 8,
    timePerQuestion: 20,
    maxLives: 3,
    emoji: "🎓",
  },
]

export function generateMathQuestions(level: MathLevel, count: number): MathQuestion[] {
  switch (level) {
    case "tk":
      return genTKQuestions(count)
    case "sd":
      return genSDQuestions(count)
    case "smp":
      return genSMPQuestions(count)
  }
}

// Helper: konversi angka ke kata untuk TTS
export function numberToSpeech(n: number): string {
  return String(n)
}
