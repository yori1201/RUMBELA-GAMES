// ============================================================
// RUMBELA GAMES - Game Data
// Materi belajar Bahasa Inggris untuk bimbel Rumbela
// ============================================================

import { EXTRA_QUIZ, EXTRA_MATCH, EXTRA_FILL, EXTRA_SPELL } from "./questions-extra"

export type Difficulty = "beginner" | "intermediate" | "advanced"
export type CategoryId = "vocabulary" | "grammar" | "conversation"

export interface QuizQuestion {
  id: string
  type: "multiple-choice"
  category: CategoryId
  difficulty: Difficulty
  question: string
  questionTranslation?: string
  options: string[]
  answer: number // index
  explanation: string
  points: number
}

export interface MatchQuestion {
  id: string
  type: "word-match"
  category: CategoryId
  difficulty: Difficulty
  pairs: { en: string; id: string }[]
  points: number
}

export interface FillBlankQuestion {
  id: string
  type: "fill-blank"
  category: CategoryId
  difficulty: Difficulty
  sentence: string // use ___ for blank
  translation: string
  options: string[]
  answer: number
  explanation: string
  points: number
}

export interface SpellQuestion {
  id: string
  type: "spell"
  category: CategoryId
  difficulty: Difficulty
  meaning: string // Indonesian meaning
  hint: string // first letter or context
  answer: string
  example: string
  points: number
}

export type GameQuestion = QuizQuestion | MatchQuestion | FillBlankQuestion | SpellQuestion

export interface CategoryInfo {
  id: CategoryId
  name: string
  icon: string
  description: string
  color: string
  gradient: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: "📚",
    description: "Perbendaharaan kata: hewan, makanan, warna, keluarga",
    color: "emerald",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "grammar",
    name: "Grammar",
    icon: "✏️",
    description: "Tata bahasa: tenses, article, preposition",
    color: "amber",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: "conversation",
    name: "Daily Conversation",
    icon: "💬",
    description: "Percakapan sehari-hari: sapaan, arah, belanja",
    color: "rose",
    gradient: "from-rose-400 to-pink-500",
  },
]

export const DIFFICULTIES: { id: Difficulty; name: string; icon: string; color: string; multiplier: number }[] = [
  { id: "beginner", name: "Beginner", icon: "🌱", color: "emerald", multiplier: 1 },
  { id: "intermediate", name: "Intermediate", icon: "⚡", color: "amber", multiplier: 1.5 },
  { id: "advanced", name: "Advanced", icon: "🔥", color: "rose", multiplier: 2 },
]

// ===== QUIZ QUESTIONS (Multiple Choice) =====
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...EXTRA_QUIZ,
  // ----- VOCABULARY: BEGINNER -----
  {
    id: "q-v-b-1",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "beginner",
    question: "What is the English word for 'kucing'?",
    questionTranslation: "Apa kata Bahasa Inggris untuk 'kucing'?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    answer: 1,
    explanation: "'Cat' artinya kucing. Contoh: 'I have a cat.' (Saya punya kucing.)",
    points: 10,
  },
  {
    id: "q-v-b-2",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "beginner",
    question: "Which one means 'merah'?",
    questionTranslation: "Mana yang berarti 'merah'?",
    options: ["Blue", "Green", "Red", "Yellow"],
    answer: 2,
    explanation: "'Red' artinya merah. Contoh: 'The apple is red.' (Apel itu merah.)",
    points: 10,
  },
  {
    id: "q-v-b-3",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "beginner",
    question: "What is the English word for 'ibu'?",
    questionTranslation: "Apa kata Bahasa Inggris untuk 'ibu'?",
    options: ["Father", "Mother", "Sister", "Brother"],
    answer: 1,
    explanation: "'Mother' artinya ibu. Contoh: 'My mother is kind.' (Ibu saya baik.)",
    points: 10,
  },
  {
    id: "q-v-b-4",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "beginner",
    question: "Which one is a fruit?",
    questionTranslation: "Mana yang merupakan buah?",
    options: ["Carrot", "Apple", "Potato", "Onion"],
    answer: 1,
    explanation: "'Apple' adalah buah apel. Carrot=wortel, Potato=kentang, Onion=bawang.",
    points: 10,
  },
  {
    id: "q-v-b-5",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "beginner",
    question: "What is the English word for 'sekolah'?",
    questionTranslation: "Apa kata Bahasa Inggris untuk 'sekolah'?",
    options: ["Hospital", "School", "Market", "Office"],
    answer: 1,
    explanation: "'School' artinya sekolah. Hospital=rumah sakit, Market=pasar.",
    points: 10,
  },
  // ----- VOCABULARY: INTERMEDIATE -----
  {
    id: "q-v-i-1",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "intermediate",
    question: "Choose the synonym of 'happy':",
    questionTranslation: "Pilih sinonim dari 'happy':",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    answer: 1,
    explanation: "'Joyful' memiliki arti sama dengan 'happy' yaitu gembira.",
    points: 15,
  },
  {
    id: "q-v-i-2",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "intermediate",
    question: "What is the antonym of 'expensive'?",
    questionTranslation: "Apa lawan kata dari 'expensive'?",
    options: ["Cheap", "Beautiful", "Heavy", "Fast"],
    answer: 0,
    explanation: "'Cheap' (murah) adalah lawan kata dari 'expensive' (mahal).",
    points: 15,
  },
  {
    id: "q-v-i-3",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "intermediate",
    question: "Choose the correct meaning of 'environment':",
    questionTranslation: "Pilih arti yang benar dari 'environment':",
    options: ["Lingkungan", "Pendidikan", "Ekonomi", "Hiburan"],
    answer: 0,
    explanation: "'Environment' artinya lingkungan. Contoh: 'Protect the environment.'",
    points: 15,
  },
  {
    id: "q-v-i-4",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "intermediate",
    question: "What does 'achieve' mean?",
    questionTranslation: "Apa arti dari 'achieve'?",
    options: ["Mencapai", "Meninggalkan", "Memutuskan", "Menghindari"],
    answer: 0,
    explanation: "'Achieve' artinya mencapai/mencapai prestasi. Contoh: 'achieve a goal.'",
    points: 15,
  },
  // ----- VOCABULARY: ADVANCED -----
  {
    id: "q-v-a-1",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "advanced",
    question: "Choose the meaning of 'ubiquitous':",
    questionTranslation: "Pilih arti dari 'ubiquitous':",
    options: ["Langka", "Ada di mana-mana", "Berbahaya", "Menguntungkan"],
    answer: 1,
    explanation: "'Ubiquitous' artinya ada di mana-mana / selalu hadir. Contoh: 'Smartphones are ubiquitous.'",
    points: 25,
  },
  {
    id: "q-v-a-2",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "advanced",
    question: "What is the meaning of 'meticulous'?",
    questionTranslation: "Apa arti dari 'meticulous'?",
    options: ["Ceroboh", "Sangat teliti", "Sombong", "Pemalas"],
    answer: 1,
    explanation: "'Meticulous' artinya sangat teliti dan cermat dalam detail.",
    points: 25,
  },
  {
    id: "q-v-a-3",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "advanced",
    question: "Choose the synonym of 'diligent':",
    questionTranslation: "Pilih sinonim dari 'diligent':",
    options: ["Hardworking", "Lazy", "Careless", "Rude"],
    answer: 0,
    explanation: "'Diligent' = rajin, sinonimnya 'hardworking'.",
    points: 25,
  },

  // ----- GRAMMAR: BEGINNER -----
  {
    id: "q-g-b-1",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "beginner",
    question: "Choose the correct article: '___ apple a day keeps the doctor away.'",
    questionTranslation: "Pilih article yang benar:",
    options: ["A", "An", "The", "—"],
    answer: 1,
    explanation: "Pakai 'An' karena 'apple' diawali bunyi vokal. Aturan: a+konsonan, an+vokal.",
    points: 10,
  },
  {
    id: "q-g-b-2",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "beginner",
    question: "Choose the correct pronoun: '___ is my best friend.' (laki-laki)",
    questionTranslation: "Pilih pronoun yang benar:",
    options: ["She", "He", "It", "They"],
    answer: 1,
    explanation: "'He' untuk laki-laki tunggal. She=perempuan, It=benda/hewan, They=jamak.",
    points: 10,
  },
  {
    id: "q-g-b-3",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "beginner",
    question: "Choose the correct verb: 'She ___ to school every day.'",
    questionTranslation: "Pilih verb yang benar:",
    options: ["go", "goes", "going", "went"],
    answer: 1,
    explanation: "Subjek 'She' (orang ketiga tunggal) → verb +s/es → 'goes'.",
    points: 10,
  },
  {
    id: "q-g-b-4",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "beginner",
    question: "Choose the correct preposition: 'The book is ___ the table.'",
    questionTranslation: "Pilih preposition yang benar:",
    options: ["in", "on", "at", "under"],
    answer: 1,
    explanation: "'On' untuk permukaan datar. Buku di ATAS meja = 'on the table'.",
    points: 10,
  },
  // ----- GRAMMAR: INTERMEDIATE -----
  {
    id: "q-g-i-1",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "intermediate",
    question: "Choose the correct tense: 'I ___ my homework yesterday.'",
    questionTranslation: "Pilih tense yang benar:",
    options: ["do", "did", "done", "doing"],
    answer: 1,
    explanation: "'Yesterday' menandakan past tense → 'did'. Bentuk lampau dari 'do'.",
    points: 15,
  },
  {
    id: "q-g-i-2",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "intermediate",
    question: "Choose the correct form: 'They ___ playing football now.'",
    questionTranslation: "Pilih bentuk yang benar:",
    options: ["is", "am", "are", "be"],
    answer: 2,
    explanation: "Subjek 'They' (jamak) → 'are' + V-ing untuk present continuous.",
    points: 15,
  },
  {
    id: "q-g-i-3",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "intermediate",
    question: "Choose the correct comparative: 'This test is ___ than before.'",
    questionTranslation: "Pilih comparative yang benar:",
    options: ["difficult", "more difficult", "most difficult", "difficulter"],
    answer: 1,
    explanation: "Adjective panjang (≥3 suku kata) pakai 'more' + adjective untuk comparative.",
    points: 15,
  },
  {
    id: "q-g-i-4",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "intermediate",
    question: "Choose the correct sentence:",
    questionTranslation: "Pilih kalimat yang benar:",
    options: [
      "I doesn't like coffee.",
      "I don't likes coffee.",
      "I don't like coffee.",
      "I not like coffee.",
    ],
    answer: 2,
    explanation: "Pola: S + don't/doesn't + V1. 'I don't like' = saya tidak suka.",
    points: 15,
  },
  // ----- GRAMMAR: ADVANCED -----
  {
    id: "q-g-a-1",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "advanced",
    question: "Choose the correct sentence (conditional):",
    questionTranslation: "Pilih kalimat conditional yang benar:",
    options: [
      "If I will study, I pass the exam.",
      "If I study, I will pass the exam.",
      "If I studied, I will pass the exam.",
      "If I study, I would pass the exam.",
    ],
    answer: 1,
    explanation: "Conditional type 1: If + present, will + V1. Untuk kemungkinan di masa depan.",
    points: 25,
  },
  {
    id: "q-g-a-2",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "advanced",
    question: "Choose the correct passive form: 'The letter ___ yesterday.'",
    questionTranslation: "Pilih bentuk pasif yang benar:",
    options: ["was written", "wrote", "is writing", "writes"],
    answer: 0,
    explanation: "Passive past: was/were + V3. 'was written' = ditulis (kemarin).",
    points: 25,
  },
  {
    id: "q-g-a-3",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "advanced",
    question: "Choose the correct relative clause: 'The man ___ called you is my uncle.'",
    questionTranslation: "Pilih relative clause yang benar:",
    options: ["which", "who", "whose", "where"],
    answer: 1,
    explanation: "'Who' untuk orang sebagai subjek. 'The man who called...' = pria yang menelepon...",
    points: 25,
  },

  // ----- CONVERSATION: BEGINNER -----
  {
    id: "q-c-b-1",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "beginner",
    question: "How do you greet someone in the morning?",
    questionTranslation: "Bagaimana kamu menyapa seseorang di pagi hari?",
    options: ["Good night", "Good morning", "Good evening", "Goodbye"],
    answer: 1,
    explanation: "'Good morning' untuk sapaan pagi (sebelum jam 12 siang).",
    points: 10,
  },
  {
    id: "q-c-b-2",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "beginner",
    question: "Someone says 'Thank you'. How do you reply?",
    questionTranslation: "Seseorang bilang 'Thank you'. Bagaimana kamu membalas?",
    options: ["Sorry", "You're welcome", "Hello", "Goodbye"],
    answer: 1,
    explanation: "'You're welcome' adalah balasan sopan untuk 'thank you' (sama-sama).",
    points: 10,
  },
  {
    id: "q-c-b-3",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "beginner",
    question: "How do you ask someone's name?",
    questionTranslation: "Bagaimana kamu menanyakan nama seseorang?",
    options: [
      "How old are you?",
      "Where are you from?",
      "What is your name?",
      "How are you?",
    ],
    answer: 2,
    explanation: "'What is your name?' untuk menanyakan nama. Bentuk sopan: 'May I know your name?'",
    points: 10,
  },
  {
    id: "q-c-b-4",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "beginner",
    question: "How do you say 'apa kabar?' in English?",
    questionTranslation: "Bagaimana cara mengatakan 'apa kabar?' dalam Bahasa Inggris?",
    options: [
      "What is your name?",
      "How are you?",
      "Where are you?",
      "Who are you?",
    ],
    answer: 1,
    explanation: "'How are you?' = apa kabar. Balasan umum: 'I'm fine, thank you.'",
    points: 10,
  },
  // ----- CONVERSATION: INTERMEDIATE -----
  {
    id: "q-c-i-1",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "intermediate",
    question: "You're at a restaurant. How do you order politely?",
    questionTranslation: "Kamu di restoran. Bagaimana cara memesan dengan sopan?",
    options: [
      "Give me a burger!",
      "I want burger now.",
      "Could I have a burger, please?",
      "Burger, quick!",
    ],
    answer: 2,
    explanation: "Pola sopan: 'Could I have...please?' lebih santun daripada 'Give me...'",
    points: 15,
  },
  {
    id: "q-c-i-2",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "intermediate",
    question: "How do you ask for directions to the hospital?",
    questionTranslation: "Bagaimana kamu menanyakan arah ke rumah sakit?",
    options: [
      "Where hospital?",
      "How to hospital?",
      "Excuse me, how do I get to the hospital?",
      "Hospital where?",
    ],
    answer: 2,
    explanation: "Pola sopan menanyakan arah: 'Excuse me, how do I get to...?'",
    points: 15,
  },
  {
    id: "q-c-i-3",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "intermediate",
    question: "How do you politely decline an invitation?",
    questionTranslation: "Bagaimana kamu menolak undangan dengan sopan?",
    options: [
      "No, I won't come.",
      "I don't want to.",
      "I'm sorry, I can't make it. Maybe next time.",
      "Not interested.",
    ],
    answer: 2,
    explanation: "Tolak dengan alasan + alternatif: 'I'm sorry, I can't. Maybe next time.'",
    points: 15,
  },
  // ----- CONVERSATION: ADVANCED -----
  {
    id: "q-c-a-1",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "advanced",
    question: "In a job interview, how do you introduce yourself professionally?",
    questionTranslation: "Dalam wawancara kerja, bagaimana memperkenalkan diri?",
    options: [
      "Hi, I'm John and I like games.",
      "My name is John. I have 5 years of experience in marketing.",
      "I'm John. Give me a job.",
      "John here. I need money.",
    ],
    answer: 1,
    explanation: "Perkenalan profesional: nama + pengalaman/keahlian relevan.",
    points: 25,
  },
  {
    id: "q-c-a-2",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "advanced",
    question: "How do you express disagreement politely in a meeting?",
    questionTranslation: "Bagaimana menyampaikan ketidaksetujuan dengan sopan dalam rapat?",
    options: [
      "You're wrong.",
      "That's a bad idea.",
      "I see your point, but I have a different perspective.",
      "No, that's stupid.",
    ],
    answer: 2,
    explanation: "Acknowledge dulu, lalu sampaikan pendapat. Lebih sopan dan konstruktif.",
    points: 25,
  },
  {
    id: "q-v-a-4",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "advanced",
    question: "Choose the synonym of 'meticulous'.",
    questionTranslation: "Pilih sinonim dari 'meticulous' (teliti).",
    options: ["careless", "thorough", "lazy", "rude"],
    answer: 1,
    explanation: "'Thorough' = menyeluruh, teliti. Sama makna dengan 'meticulous'.",
    points: 25,
  },
  {
    id: "q-v-a-5",
    type: "multiple-choice",
    category: "vocabulary",
    difficulty: "advanced",
    question: "What does 'resilient' mean?",
    questionTranslation: "Apa arti dari 'resilient'?",
    options: [
      "Tangguh, mampu pulih dari kesulitan",
      "Pemalu, mudah tersinggung",
      "Sombong, merasa hebat",
      "Cepat marah dan agresif",
    ],
    answer: 0,
    explanation: "'Resilient' = tangguh, pantang menyerah, mampu pulih dari kesulitan.",
    points: 25,
  },
  {
    id: "q-g-a-4",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "advanced",
    question: "Identify the correct sentence:",
    questionTranslation: "Pilih kalimat yang benar:",
    options: [
      "He suggested me to go home early.",
      "He suggested that I go home early.",
      "He suggested me going home early.",
      "He suggested to me go home early.",
    ],
    answer: 1,
    explanation: "Setelah 'suggest' gunakan 'that + clause' atau 'suggest + V-ing' (without object).",
    points: 25,
  },
  {
    id: "q-g-a-5",
    type: "multiple-choice",
    category: "grammar",
    difficulty: "advanced",
    question: "Choose the correct conditional sentence (type 3):",
    questionTranslation: "Pilih kalimat conditional type 3 yang benar:",
    options: [
      "If I had studied, I would pass the exam.",
      "If I studied, I would have passed the exam.",
      "If I had studied, I would have passed the exam.",
      "If I study, I will pass the exam.",
    ],
    answer: 2,
    explanation: "Conditional type 3: If + had + V3, would have + V3. Untuk penyesalan di masa lalu.",
    points: 25,
  },
  {
    id: "q-c-a-3",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "advanced",
    question: "Which is the most formal way to ask for a favor?",
    questionTranslation: "Mana cara paling formal untuk meminta tolong?",
    options: [
      "Help me with this.",
      "Can you help me?",
      "Could you possibly assist me with this?",
      "I want you to help me.",
    ],
    answer: 2,
    explanation: "'Could you possibly...' adalah bentuk permintaan paling formal dan sopan.",
    points: 25,
  },
  {
    id: "q-c-a-4",
    type: "multiple-choice",
    category: "conversation",
    difficulty: "advanced",
    question: "How to politely decline an invitation?",
    questionTranslation: "Bagaimana menolak undangan dengan sopan?",
    options: [
      "No, I won't come.",
      "I don't want to.",
      "I'd love to, but I have another commitment. Thank you for inviting me.",
      "Why would I come?",
    ],
    answer: 2,
    explanation: "Mulai dengan apresiasi ('I'd love to'), beri alasan singkat, dan tutup dengan terima kasih.",
    points: 25,
  },
]

// ===== WORD MATCH QUESTIONS =====
export const MATCH_QUESTIONS: MatchQuestion[] = [
  ...EXTRA_MATCH,
  {
    id: "m-v-b-1",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Book", id: "Buku" },
      { en: "Pencil", id: "Pensil" },
      { en: "Chair", id: "Kursi" },
      { en: "Table", id: "Meja" },
    ],
    points: 40,
  },
  {
    id: "m-v-b-2",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Dog", id: "Anjing" },
      { en: "Cat", id: "Kucing" },
      { en: "Bird", id: "Burung" },
      { en: "Fish", id: "Ikan" },
    ],
    points: 40,
  },
  {
    id: "m-v-i-1",
    type: "word-match",
    category: "vocabulary",
    difficulty: "intermediate",
    pairs: [
      { en: "Beautiful", id: "Indah" },
      { en: "Dangerous", id: "Berbahaya" },
      { en: "Important", id: "Penting" },
      { en: "Difficult", id: "Sulit" },
    ],
    points: 60,
  },
  {
    id: "m-g-b-1",
    type: "word-match",
    category: "grammar",
    difficulty: "beginner",
    pairs: [
      { en: "Noun", id: "Kata benda" },
      { en: "Verb", id: "Kata kerja" },
      { en: "Adjective", id: "Kata sifat" },
      { en: "Adverb", id: "Kata keterangan" },
    ],
    points: 40,
  },
  {
    id: "m-c-b-1",
    type: "word-match",
    category: "conversation",
    difficulty: "beginner",
    pairs: [
      { en: "Hello", id: "Halo" },
      { en: "Goodbye", id: "Sampai jumpa" },
      { en: "Please", id: "Tolong" },
      { en: "Sorry", id: "Maaf" },
    ],
    points: 40,
  },
  {
    id: "m-v-b-3",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Apple", id: "Apel" },
      { en: "Banana", id: "Pisang" },
      { en: "Rice", id: "Nasi" },
      { en: "Milk", id: "Susu" },
    ],
    points: 40,
  },
  {
    id: "m-v-b-4",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Red", id: "Merah" },
      { en: "Blue", id: "Biru" },
      { en: "Green", id: "Hijau" },
      { en: "Yellow", id: "Kuning" },
    ],
    points: 40,
  },
  {
    id: "m-v-b-5",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Father", id: "Ayah" },
      { en: "Mother", id: "Ibu" },
      { en: "Brother", id: "Saudara laki-laki" },
      { en: "Sister", id: "Saudara perempuan" },
    ],
    points: 40,
  },
  {
    id: "m-v-b-6",
    type: "word-match",
    category: "vocabulary",
    difficulty: "beginner",
    pairs: [
      { en: "Head", id: "Kepala" },
      { en: "Hand", id: "Tangan" },
      { en: "Foot", id: "Kaki" },
      { en: "Eye", id: "Mata" },
    ],
    points: 40,
  },
  {
    id: "m-v-i-2",
    type: "word-match",
    category: "vocabulary",
    difficulty: "intermediate",
    pairs: [
      { en: "Quickly", id: "Dengan cepat" },
      { en: "Slowly", id: "Dengan lambat" },
      { en: "Carefully", id: "Dengan hati-hati" },
      { en: "Loudly", id: "Dengan keras" },
    ],
    points: 60,
  },
  {
    id: "m-v-i-3",
    type: "word-match",
    category: "vocabulary",
    difficulty: "intermediate",
    pairs: [
      { en: "Happy", id: "Senang" },
      { en: "Sad", id: "Sedih" },
      { en: "Angry", id: "Marah" },
      { en: "Tired", id: "Lelah" },
    ],
    points: 60,
  },
  {
    id: "m-v-i-4",
    type: "word-match",
    category: "vocabulary",
    difficulty: "intermediate",
    pairs: [
      { en: "Doctor", id: "Dokter" },
      { en: "Teacher", id: "Guru" },
      { en: "Farmer", id: "Petani" },
      { en: "Driver", id: "Pengemudi" },
    ],
    points: 60,
  },
  {
    id: "m-v-a-1",
    type: "word-match",
    category: "vocabulary",
    difficulty: "advanced",
    pairs: [
      { en: "Eloquent", id: "Fasih berbicara" },
      { en: "Resilient", id: "Tangguh / pantang menyerah" },
      { en: "Meticulous", id: "Teliti / sangat berhati-hati" },
      { en: "Innovative", id: "Inovatif / pemikiran baru" },
    ],
    points: 80,
  },
  {
    id: "m-v-a-2",
    type: "word-match",
    category: "vocabulary",
    difficulty: "advanced",
    pairs: [
      { en: "Compromise", id: "Kompromi / kesepakatan" },
      { en: "Negotiate", id: "Berenegosiasi" },
      { en: "Collaborate", id: "Berkolaborasi" },
      { en: "Accomplish", id: "Mencapai / menyelesaikan" },
    ],
    points: 80,
  },
  {
    id: "m-g-b-2",
    type: "word-match",
    category: "grammar",
    difficulty: "beginner",
    pairs: [
      { en: "Run", id: "Berlari (kata kerja)" },
      { en: "Beautiful", id: "Indah (kata sifat)" },
      { en: "Quickly", id: "Dengan cepat (kata keterangan)" },
      { en: "House", id: "Rumah (kata benda)" },
    ],
    points: 40,
  },
  {
    id: "m-g-i-1",
    type: "word-match",
    category: "grammar",
    difficulty: "intermediate",
    pairs: [
      { en: "Past Tense", id: "Masa lampau" },
      { en: "Present Tense", id: "Masa sekarang" },
      { en: "Future Tense", id: "Masa depan" },
      { en: "Perfect Tense", id: "Telah terjadi" },
    ],
    points: 60,
  },
  {
    id: "m-g-i-2",
    type: "word-match",
    category: "grammar",
    difficulty: "intermediate",
    pairs: [
      { en: "Subject", id: "Subjek (yang melakukan)" },
      { en: "Verb", id: "Predikat (kata kerja)" },
      { en: "Object", id: "Objek (yang dikenai)" },
      { en: "Adverb", id: "Keterangan (kapan/mana)" },
    ],
    points: 60,
  },
  {
    id: "m-g-a-1",
    type: "word-match",
    category: "grammar",
    difficulty: "advanced",
    pairs: [
      { en: "Passive Voice", id: "Kalimat pasif" },
      { en: "Active Voice", id: "Kalimat aktif" },
      { en: "Direct Speech", id: "Kalimat langsung" },
      { en: "Indirect Speech", id: "Kalimat tak langsung" },
    ],
    points: 80,
  },
  {
    id: "m-g-a-2",
    type: "word-match",
    category: "grammar",
    difficulty: "advanced",
    pairs: [
      { en: "Conditional", id: "Bersyarat (if)" },
      { en: "Subjunctive", id: "Bentuk hipotetis / pengandaian" },
      { en: "Imperative", id: "Bentuk perintah" },
      { en: "Interrogative", id: "Pertanyaan" },
    ],
    points: 80,
  },
  {
    id: "m-c-b-2",
    type: "word-match",
    category: "conversation",
    difficulty: "beginner",
    pairs: [
      { en: "Yes", id: "Ya" },
      { en: "No", id: "Tidak" },
      { en: "Maybe", id: "Mungkin" },
      { en: "Okay", id: "Oke" },
    ],
    points: 40,
  },
  {
    id: "m-c-b-3",
    type: "word-match",
    category: "conversation",
    difficulty: "beginner",
    pairs: [
      { en: "Thank you", id: "Terima kasih" },
      { en: "Welcome", id: "Selamat datang" },
      { en: "Excuse me", id: "Permisi" },
      { en: "Good morning", id: "Selamat pagi" },
    ],
    points: 40,
  },
  {
    id: "m-c-i-1",
    type: "word-match",
    category: "conversation",
    difficulty: "intermediate",
    pairs: [
      { en: "Could you help me?", id: "Bisakah kamu bantu saya?" },
      { en: "I'd like to order", id: "Saya ingin pesan" },
      { en: "Where is the toilet?", id: "Di mana toilet?" },
      { en: "How much is it?", id: "Berapa harganya?" },
    ],
    points: 60,
  },
  {
    id: "m-c-i-2",
    type: "word-match",
    category: "conversation",
    difficulty: "intermediate",
    pairs: [
      { en: "I agree", id: "Saya setuju" },
      { en: "I disagree", id: "Saya tidak setuju" },
      { en: "I'm not sure", id: "Saya tidak yakin" },
      { en: "It depends", id: "Tergantung" },
    ],
    points: 60,
  },
  {
    id: "m-c-a-1",
    type: "word-match",
    category: "conversation",
    difficulty: "advanced",
    pairs: [
      { en: "I'd appreciate it if...", id: "Saya sangat berterima kasih jika..." },
      { en: "Would you mind...", id: "Apakah Anda keberatan..." },
      { en: "I was wondering if...", id: "Saya ingin tahu apakah..." },
      { en: "Could you possibly...", id: "Apakah mungkin Anda bisa..." },
    ],
    points: 80,
  },
  {
    id: "m-c-a-2",
    type: "word-match",
    category: "conversation",
    difficulty: "advanced",
    pairs: [
      { en: "Apology accepted", id: "Maaf diterima" },
      { en: "No worries", id: "Tidak masalah" },
      { en: "It's been a pleasure", id: "Senang berkenalan" },
      { en: "Let's keep in touch", id: "Mari tetap berhubungan" },
    ],
    points: 80,
  },
]

// ===== FILL IN THE BLANK QUESTIONS =====
export const FILL_BLANK_QUESTIONS: FillBlankQuestion[] = [
  ...EXTRA_FILL,
  {
    id: "f-v-b-1",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "I drink ___ every morning to stay healthy.",
    translation: "Saya minum ___ setiap pagi untuk tetap sehat.",
    options: ["water", "car", "table", "phone"],
    answer: 0,
    explanation: "Yang masuk akal diminum adalah 'water' (air).",
    points: 10,
  },
  {
    id: "f-v-b-2",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "The ___ is yellow and shines in the sky.",
    translation: "___ itu kuning dan bersinar di langit.",
    options: ["moon", "sun", "cloud", "star"],
    answer: 1,
    explanation: "'Sun' (matahari) berwarna kuning dan bersinar di langit.",
    points: 10,
  },
  {
    id: "f-g-i-1",
    type: "fill-blank",
    category: "grammar",
    difficulty: "intermediate",
    sentence: "She ___ been studying for three hours.",
    translation: "Dia sudah belajar selama tiga jam.",
    options: ["has", "have", "is", "was"],
    answer: 0,
    explanation: "Present perfect: S + has/have + been + V-ing. She → has.",
    points: 15,
  },
  {
    id: "f-g-i-2",
    type: "fill-blank",
    category: "grammar",
    difficulty: "intermediate",
    sentence: "If it rains, we ___ stay at home.",
    translation: "Jika hujan, kita akan tetap di rumah.",
    options: ["will", "would", "had", "was"],
    answer: 0,
    explanation: "Conditional type 1: If + present, will + V1.",
    points: 15,
  },
  {
    id: "f-c-b-1",
    type: "fill-blank",
    category: "conversation",
    difficulty: "beginner",
    sentence: "A: 'How are you?' B: 'I'm ___, thank you.'",
    translation: "A: 'Apa kabar?' B: 'Saya baik, terima kasih.'",
    options: ["fine", "tree", "shoe", "ball"],
    answer: 0,
    explanation: "'I'm fine, thank you.' adalah balasan standar untuk 'How are you?'",
    points: 10,
  },
  {
    id: "f-v-b-3",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "I have two ___ and one brother.",
    translation: "Saya punya dua saudara perempuan dan satu saudara laki-laki.",
    options: ["sisters", "shoes", "books", "cars"],
    answer: 0,
    explanation: "Sisters = saudara perempuan. Konteks keluarga.",
    points: 10,
  },
  {
    id: "f-v-b-4",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "The sky is ___ today.",
    translation: "Langit berwarna biru hari ini.",
    options: ["blue", "table", "loud", "fast"],
    answer: 0,
    explanation: "Warna langit yang jelas adalah 'blue' (biru).",
    points: 10,
  },
  {
    id: "f-v-b-5",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "A cat has four ___ and a long tail.",
    translation: "Kucing punya empat kaki dan ekor panjang.",
    options: ["legs", "wings", "doors", "wheels"],
    answer: 0,
    explanation: "Kucing berjalan dengan 'legs' (kaki).",
    points: 10,
  },
  {
    id: "f-v-b-6",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "beginner",
    sentence: "I write with a ___ every day.",
    translation: "Saya menulis dengan pena setiap hari.",
    options: ["pen", "cup", "rock", "shirt"],
    answer: 0,
    explanation: "'Pen' (pena) digunakan untuk menulis.",
    points: 10,
  },
  {
    id: "f-v-i-1",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "intermediate",
    sentence: "The teacher was very ___ with the student's progress.",
    translation: "Guru sangat puas dengan kemajuan siswa.",
    options: ["pleased", "agree", "fast", "loud"],
    answer: 0,
    explanation: "'Pleased' = puas. Kata sifat setelah 'very'.",
    points: 15,
  },
  {
    id: "f-v-i-2",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "intermediate",
    sentence: "The market is always ___ on weekends.",
    translation: "Pasar selalu ramai di akhir pekan.",
    options: ["crowded", "tall", "fresh", "yellow"],
    answer: 0,
    explanation: "'Crowded' = ramai/padat. Konteks pasar.",
    points: 15,
  },
  {
    id: "f-v-a-1",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "advanced",
    sentence: "His speech was so ___ that the audience was left speechless.",
    translation: "Pidatonya begitu fasih sehingga audiens terdiam.",
    options: ["eloquent", "fast", "green", "noisy"],
    answer: 0,
    explanation: "'Eloquent' = fasih/berkat bicara baik. Konteks pidato.",
    points: 25,
  },
  {
    id: "f-v-a-2",
    type: "fill-blank",
    category: "vocabulary",
    difficulty: "advanced",
    sentence: "Despite many failures, she remained ___ and tried again.",
    translation: "Meski banyak gagal, dia tetap tangguh dan mencoba lagi.",
    options: ["resilient", "lazy", "small", "angry"],
    answer: 0,
    explanation: "'Resilient' = tangguh, pantang menyerah.",
    points: 25,
  },
  {
    id: "f-g-b-1",
    type: "fill-blank",
    category: "grammar",
    difficulty: "beginner",
    sentence: "She ___ to school every day.",
    translation: "Dia pergi ke sekolah setiap hari.",
    options: ["goes", "go", "going", "gone"],
    answer: 0,
    explanation: "Simple present, subject 'she' (orang ketiga tunggal) → 'goes'.",
    points: 10,
  },
  {
    id: "f-g-b-2",
    type: "fill-blank",
    category: "grammar",
    difficulty: "beginner",
    sentence: "There ___ an apple on the table.",
    translation: "Ada apel di atas meja.",
    options: ["is", "are", "am", "be"],
    answer: 0,
    explanation: "'Apple' = tunggal (singular) → 'is'.",
    points: 10,
  },
  {
    id: "f-g-b-3",
    type: "fill-blank",
    category: "grammar",
    difficulty: "beginner",
    sentence: "I ___ a student.",
    translation: "Saya seorang siswa.",
    options: ["am", "is", "are", "be"],
    answer: 0,
    explanation: "Subject 'I' selalu pakai 'am'.",
    points: 10,
  },
  {
    id: "f-g-i-3",
    type: "fill-blank",
    category: "grammar",
    difficulty: "intermediate",
    sentence: "The book ___ by millions of readers since 1990.",
    translation: "Buku itu telah dibaca jutaan pembaca sejak 1990.",
    options: ["has been read", "read", "is reading", "reads"],
    answer: 0,
    explanation: "Present perfect passive: has/have + been + V3.",
    points: 15,
  },
  {
    id: "f-g-i-4",
    type: "fill-blank",
    category: "grammar",
    difficulty: "intermediate",
    sentence: "She ___ when the phone rang.",
    translation: "Dia sedang memasak saat telepon berbunyi.",
    options: ["was cooking", "cooks", "cooked", "has cooked"],
    answer: 0,
    explanation: "Past continuous: was/were + V-ing (sedang berlangsung saat peristiwa lain terjadi).",
    points: 15,
  },
  {
    id: "f-g-a-1",
    type: "fill-blank",
    category: "grammar",
    difficulty: "advanced",
    sentence: "If I ___ you, I would apologize immediately.",
    translation: "Jika saya kamu, saya akan segera meminta maaf.",
    options: ["were", "am", "was", "be"],
    answer: 0,
    explanation: "Conditional type 2 (hipotetis): If + were (subjunctive) + would + V1.",
    points: 25,
  },
  {
    id: "f-g-a-2",
    type: "fill-blank",
    category: "grammar",
    difficulty: "advanced",
    sentence: "By next year, she ___ here for a decade.",
    translation: "Tahun depan, dia akan sudah tinggal di sini selama satu dekade.",
    options: ["will have lived", "lives", "lived", "is living"],
    answer: 0,
    explanation: "Future perfect: will + have + V3 (menyatakan durasi sampai titik di masa depan).",
    points: 25,
  },
  {
    id: "f-g-a-3",
    type: "fill-blank",
    category: "grammar",
    difficulty: "advanced",
    sentence: "The letter ___ written by Tom was delivered yesterday.",
    translation: "Surat yang ditulis Tom telah dikirim kemarin.",
    options: ["which was", "which is", "who was", "what was"],
    answer: 0,
    explanation: "Relative clause dengan 'which' untuk benda (letter).",
    points: 25,
  },
  {
    id: "f-c-b-2",
    type: "fill-blank",
    category: "conversation",
    difficulty: "beginner",
    sentence: "A: 'What's your name?' B: '___ name is Andi.'",
    translation: "A: 'Siapa namamu?' B: 'Nama saya Andi.'",
    options: ["My", "Me", "I", "Mine"],
    answer: 0,
    explanation: "Possessive adjective: 'My name'.",
    points: 10,
  },
  {
    id: "f-c-b-3",
    type: "fill-blank",
    category: "conversation",
    difficulty: "beginner",
    sentence: "A: '___ are you from?' B: 'I'm from Bandung.'",
    translation: "A: 'Kamu dari mana?' B: 'Saya dari Bandung.'",
    options: ["Where", "When", "Why", "How"],
    answer: 0,
    explanation: "'Where' untuk menanyakan tempat.",
    points: 10,
  },
  {
    id: "f-c-i-1",
    type: "fill-blank",
    category: "conversation",
    difficulty: "intermediate",
    sentence: "A: 'Can I speak to Mr. Budi?' B: '___, please. I'll check if he's available.'",
    translation: "A: 'Boleh bicara dengan Pak Budi?' B: 'Tunggu sebentar, saya cek dulu.'",
    options: ["Hold on", "Hang up", "Call back", "Wrong number"],
    answer: 0,
    explanation: "'Hold on' = tunggu sebentar (di telepon).",
    points: 15,
  },
  {
    id: "f-c-i-2",
    type: "fill-blank",
    category: "conversation",
    difficulty: "intermediate",
    sentence: "A: 'I'm sorry I broke your cup.' B: 'Don't worry, it ___, I have another one.'",
    translation: "A: 'Maaf saya pecahkan gagangnya.' B: 'Tidak apa-apa, saya punya yang lain.'",
    options: ["doesn't matter", "is broken", "was expensive", "is mine"],
    answer: 0,
    explanation: "'It doesn't matter' = tidak apa-apa / tidak masalah.",
    points: 15,
  },
  {
    id: "f-c-a-1",
    type: "fill-blank",
    category: "conversation",
    difficulty: "advanced",
    sentence: "A: 'Would you ___ opening the window?' B: 'Not at all, go ahead.'",
    translation: "A: 'Apakah Anda keberatan membuka jendela?' B: 'Tidak sama sekali.'",
    options: ["mind", "want", "like", "rather"],
    answer: 0,
    explanation: "'Would you mind + V-ing' = permintaan sopan formal.",
    points: 25,
  },
  {
    id: "f-c-a-2",
    type: "fill-blank",
    category: "conversation",
    difficulty: "advanced",
    sentence: "A: 'I was ___ if you could help me with this project.' B: 'Of course, I'd be glad to.'",
    translation: "A: 'Saya ingin tahu apakah Anda bisa membantu proyek ini.' B: 'Tentu, dengan senang hati.'",
    options: ["wondering", "thinking", "asking", "telling"],
    answer: 0,
    explanation: "'I was wondering if...' = bentuk permintaan sangat sopan dalam Bahasa Inggris formal.",
    points: 25,
  },
]

// ===== SPELL QUESTIONS =====
export const SPELL_QUESTIONS: SpellQuestion[] = [
  ...EXTRA_SPELL,
  {
    id: "s-v-b-1",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Buku (benda untuk dibaca)",
    hint: "B___",
    answer: "book",
    example: "I read a book every night.",
    points: 15,
  },
  {
    id: "s-v-b-2",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Apel (buah merah/hijau)",
    hint: "A___",
    answer: "apple",
    example: "An apple a day keeps the doctor away.",
    points: 15,
  },
  {
    id: "s-v-b-3",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Sekolah (tempat belajar)",
    hint: "S___",
    answer: "school",
    example: "I go to school by bus.",
    points: 15,
  },
  {
    id: "s-v-i-1",
    type: "spell",
    category: "vocabulary",
    difficulty: "intermediate",
    meaning: "Penting (mempunyai nilai besar)",
    hint: "I___",
    answer: "important",
    example: "Family is important to me.",
    points: 25,
  },
  {
    id: "s-g-i-1",
    type: "spell",
    category: "grammar",
    difficulty: "intermediate",
    meaning: "Masa lalu / lampau (tense)",
    hint: "P___",
    answer: "past",
    example: "Simple past tense is used for completed actions.",
    points: 25,
  },
  {
    id: "s-c-b-1",
    type: "spell",
    category: "conversation",
    difficulty: "beginner",
    meaning: "Maaf (permintaan maaf)",
    hint: "S___",
    answer: "sorry",
    example: "I'm sorry I'm late.",
    points: 15,
  },
  {
    id: "s-v-b-4",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Air (minuman sehat)",
    hint: "W___",
    answer: "water",
    example: "I drink water every morning.",
    points: 15,
  },
  {
    id: "s-v-b-5",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Tangan (anggota tubuh)",
    hint: "H___",
    answer: "hand",
    example: "Raise your hand if you have a question.",
    points: 15,
  },
  {
    id: "s-v-b-6",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Mata (indra penglihatan)",
    hint: "E___",
    answer: "eye",
    example: "I have two eyes to see.",
    points: 15,
  },
  {
    id: "s-v-b-7",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Rumah (tempat tinggal)",
    hint: "H___",
    answer: "house",
    example: "My house is near the school.",
    points: 15,
  },
  {
    id: "s-v-b-8",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Hijau (warna daun)",
    hint: "G___",
    answer: "green",
    example: "The grass is green.",
    points: 15,
  },
  {
    id: "s-v-b-9",
    type: "spell",
    category: "vocabulary",
    difficulty: "beginner",
    meaning: "Ayah (orang tua laki-laki)",
    hint: "F___",
    answer: "father",
    example: "My father works in a bank.",
    points: 15,
  },
  {
    id: "s-v-i-2",
    type: "spell",
    category: "vocabulary",
    difficulty: "intermediate",
    meaning: "Berbahaya (mungkin menimbulkan kerugian)",
    hint: "D___",
    answer: "dangerous",
    example: "It's dangerous to play with fire.",
    points: 25,
  },
  {
    id: "s-v-i-3",
    type: "spell",
    category: "vocabulary",
    difficulty: "intermediate",
    meaning: "Indah (enak dipandang)",
    hint: "B___",
    answer: "beautiful",
    example: "What a beautiful sunset!",
    points: 25,
  },
  {
    id: "s-v-i-4",
    type: "spell",
    category: "vocabulary",
    difficulty: "intermediate",
    meaning: "Marah (perasaan tidak suka)",
    hint: "A___",
    answer: "angry",
    example: "Don't be angry with me.",
    points: 25,
  },
  {
    id: "s-v-i-5",
    type: "spell",
    category: "vocabulary",
    difficulty: "intermediate",
    meaning: "Sulit (tidak mudah dikerjakan)",
    hint: "D___",
    answer: "difficult",
    example: "This question is difficult to answer.",
    points: 25,
  },
  {
    id: "s-v-a-1",
    type: "spell",
    category: "vocabulary",
    difficulty: "advanced",
    meaning: "Teliti / sangat berhati-hati",
    hint: "M___",
    answer: "meticulous",
    example: "She is meticulous about every detail of her work.",
    points: 35,
  },
  {
    id: "s-v-a-2",
    type: "spell",
    category: "vocabulary",
    difficulty: "advanced",
    meaning: "Fasih / pandai berbicara",
    hint: "E___",
    answer: "eloquent",
    example: "The lawyer gave an eloquent speech in court.",
    points: 35,
  },
  {
    id: "s-v-a-3",
    type: "spell",
    category: "vocabulary",
    difficulty: "advanced",
    meaning: "Tangguh / pantang menyerah",
    hint: "R___",
    answer: "resilient",
    example: "Children are often more resilient than adults realize.",
    points: 35,
  },
  {
    id: "s-g-b-1",
    type: "spell",
    category: "grammar",
    difficulty: "beginner",
    meaning: "Kata kerja (verb dalam Bahasa Inggris)",
    hint: "V___",
    answer: "verb",
    example: "Run, jump, and eat are verbs.",
    points: 15,
  },
  {
    id: "s-g-b-2",
    type: "spell",
    category: "grammar",
    difficulty: "beginner",
    meaning: "Kata benda (noun)",
    hint: "N___",
    answer: "noun",
    example: "Book, table, and cat are nouns.",
    points: 15,
  },
  {
    id: "s-g-i-2",
    type: "spell",
    category: "grammar",
    difficulty: "intermediate",
    meaning: "Subjek (yang melakukan aksi)",
    hint: "S___",
    answer: "subject",
    example: "In 'She runs', 'She' is the subject.",
    points: 25,
  },
  {
    id: "s-g-i-3",
    type: "spell",
    category: "grammar",
    difficulty: "intermediate",
    meaning: "Pasif (kalimat yang subjeknya dikenai aksi)",
    hint: "P___",
    answer: "passive",
    example: "'The cake was eaten' is a passive sentence.",
    points: 25,
  },
  {
    id: "s-g-a-1",
    type: "spell",
    category: "grammar",
    difficulty: "advanced",
    meaning: "Bersyarat (kalimat dengan 'if')",
    hint: "C___",
    answer: "conditional",
    example: "'If it rains, I will stay' is a conditional sentence.",
    points: 35,
  },
  {
    id: "s-g-a-2",
    type: "spell",
    category: "grammar",
    difficulty: "advanced",
    meaning: "Jika / dengan syarat (kata penghubung bersyarat)",
    hint: "U___",
    answer: "unless",
    example: "I won't go unless you come with me.",
    points: 35,
  },
  {
    id: "s-c-b-2",
    type: "spell",
    category: "conversation",
    difficulty: "beginner",
    meaning: "Tolong (kata untuk meminta pertolongan)",
    hint: "P___",
    answer: "please",
    example: "Please pass me the salt.",
    points: 15,
  },
  {
    id: "s-c-b-3",
    type: "spell",
    category: "conversation",
    difficulty: "beginner",
    meaning: "Terima kasih (ungkapan syukur)",
    hint: "T___",
    answer: "thanks",
    example: "Thanks for helping me.",
    points: 15,
  },
  {
    id: "s-c-b-4",
    type: "spell",
    category: "conversation",
    difficulty: "beginner",
    meaning: "Ya (persetujuan)",
    hint: "Y___",
    answer: "yes",
    example: "Yes, I would love to come.",
    points: 15,
  },
  {
    id: "s-c-i-1",
    type: "spell",
    category: "conversation",
    difficulty: "intermediate",
    meaning: "Kapan (untuk menanyakan waktu)",
    hint: "W___",
    answer: "when",
    example: "When does the train arrive?",
    points: 25,
  },
  {
    id: "s-c-i-2",
    type: "spell",
    category: "conversation",
    difficulty: "intermediate",
    meaning: "Di mana (untuk menanyakan tempat)",
    hint: "W___",
    answer: "where",
    example: "Where do you live?",
    points: 25,
  },
  {
    id: "s-c-a-1",
    type: "spell",
    category: "conversation",
    difficulty: "advanced",
    meaning: "Permintaan maaf / pembenaran",
    hint: "A___",
    answer: "apology",
    example: "Please accept my sincere apology.",
    points: 35,
  },
  {
    id: "s-c-a-2",
    type: "spell",
    category: "conversation",
    difficulty: "advanced",
    meaning: "Penilaian terhadap sesuatu",
    hint: "O___",
    answer: "opinion",
    example: "In my opinion, the movie was excellent.",
    points: 35,
  },
]

// ===== HELPER FUNCTIONS =====
export function getQuestionsByCategory(
  category: CategoryId,
  difficulty: Difficulty,
  type: "multiple-choice" | "word-match" | "fill-blank" | "spell"
): GameQuestion[] {
  const allQuestions = [
    ...QUIZ_QUESTIONS,
    ...MATCH_QUESTIONS,
    ...FILL_BLANK_QUESTIONS,
    ...SPELL_QUESTIONS,
  ]
  return allQuestions.filter((q) => q.category === category && q.difficulty === difficulty && q.type === type)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ===== ACHIEVEMENTS =====
export interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  condition: (stats: PlayerStats) => boolean
}

export interface PlayerStats {
  totalScore: number
  totalCorrect: number
  totalGamesPlayed: number
  maxStreak: number
  perfectGames: number
  categoriesPlayed: CategoryId[]
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-game",
    name: "First Step",
    icon: "🎯",
    description: "Selesaikan game pertamamu",
    condition: (s) => s.totalGamesPlayed >= 1,
  },
  {
    id: "score-100",
    name: "Century",
    icon: "💯",
    description: "Raih total skor 100",
    condition: (s) => s.totalScore >= 100,
  },
  {
    id: "score-500",
    name: "Master Mind",
    icon: "🏆",
    description: "Raih total skor 500",
    condition: (s) => s.totalScore >= 500,
  },
  {
    id: "streak-5",
    name: "On Fire",
    icon: "🔥",
    description: "Dapatkan 5 jawaban benar beruntun",
    condition: (s) => s.maxStreak >= 5,
  },
  {
    id: "streak-10",
    name: "Unstoppable",
    icon: "⚡",
    description: "Dapatkan 10 jawaban benar beruntun",
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: "perfect-game",
    name: "Perfectionist",
    icon: "✨",
    description: "Selesaikan 1 game dengan skor sempurna",
    condition: (s) => s.perfectGames >= 1,
  },
  {
    id: "all-categories",
    name: "Explorer",
    icon: "🗺️",
    description: "Mainkan semua kategori",
    condition: (s) => s.categoriesPlayed.length >= 3,
  },
  {
    id: "veteran",
    name: "Veteran",
    icon: "🎖️",
    description: "Selesaikan 10 game",
    condition: (s) => s.totalGamesPlayed >= 10,
  },
]

// ============================================================
// MISSION SYSTEM - Daily & Main Quests
// ============================================================

export type MissionType = "daily" | "main"
export type MissionGoal =
  | "play-games"           // Mainkan N game
  | "answer-correct"       // Jawab benar N kali
  | "earn-points"          // Dapatkan N poin
  | "reach-streak"         // Capai streak N
  | "play-category"        // Mainkan kategori tertentu
  | "play-mode"            // Mainkan mode tertentu
  | "play-difficulty"      // Mainkan difficulty tertentu
  | "perfect-game"         // Selesaikan game sempurna
  | "earn-achievement"     // Buka achievement baru
  | "play-different-days"  // Main di N hari berbeda (consistency)

export interface Mission {
  id: string
  type: MissionType
  title: string
  description: string
  icon: string
  goal: MissionGoal
  target: number
  reward: number // XP/poin reward
  color: "owl" | "macaw" | "cardinal" | "fox" | "bee" | "beetle"
}

// ===== MAIN MISSIONS (story progression, sekali selesai) =====
export const MAIN_MISSIONS: Mission[] = [
  {
    id: "main-1",
    type: "main",
    title: "Langkah Pertama",
    description: "Selesaikan game pertamamu",
    icon: "🎯",
    goal: "play-games",
    target: 1,
    reward: 50,
    color: "owl",
  },
  {
    id: "main-2",
    type: "main",
    title: "Penjelajah Kategori",
    description: "Mainkan semua 3 kategori (Vocabulary, Grammar, Conversation)",
    icon: "🗺️",
    goal: "play-category",
    target: 3,
    reward: 100,
    color: "macaw",
  },
  {
    id: "main-3",
    type: "main",
    title: "Master Mode",
    description: "Selesaikan semua 4 mode permainan",
    icon: "🎮",
    goal: "play-mode",
    target: 4,
    reward: 150,
    color: "fox",
  },
  {
    id: "main-4",
    type: "main",
    title: "Pemberani",
    description: "Coba level Advanced",
    icon: "🔥",
    goal: "play-difficulty",
    target: 1,
    reward: 80,
    color: "cardinal",
  },
  {
    id: "main-5",
    type: "main",
    title: "Sempurna!",
    description: "Raih skor sempurna di 1 game",
    icon: "✨",
    goal: "perfect-game",
    target: 1,
    reward: 200,
    color: "bee",
  },
  {
    id: "main-6",
    type: "main",
    title: "Kolektor Achievement",
    description: "Buka 5 achievement",
    icon: "🎖️",
    goal: "earn-achievement",
    target: 5,
    reward: 150,
    color: "beetle",
  },
  {
    id: "main-7",
    type: "main",
    title: "Sang Juara",
    description: "Raih total skor 1000",
    icon: "👑",
    goal: "earn-points",
    target: 1000,
    reward: 500,
    color: "owl",
  },
  {
    id: "main-8",
    type: "main",
    title: "Konsisten",
    description: "Main di 5 hari berbeda",
    icon: "📅",
    goal: "play-different-days",
    target: 5,
    reward: 250,
    color: "macaw",
  },
]

// ===== DAILY MISSIONS (reset tiap hari, 3 misi acak) =====
export const DAILY_MISSION_POOL: Mission[] = [
  {
    id: "daily-play-2",
    type: "daily",
    title: "Pemanasan Pagi",
    description: "Mainkan 2 game hari ini",
    icon: "☀️",
    goal: "play-games",
    target: 2,
    reward: 30,
    color: "bee",
  },
  {
    id: "daily-play-3",
    type: "daily",
    title: "Aktif Berlatih",
    description: "Mainkan 3 game hari ini",
    icon: "📚",
    goal: "play-games",
    target: 3,
    reward: 50,
    color: "owl",
  },
  {
    id: "daily-correct-5",
    type: "daily",
    title: "Lima Tepat",
    description: "Jawab 5 pertanyaan dengan benar hari ini",
    icon: "✅",
    goal: "answer-correct",
    target: 5,
    reward: 30,
    color: "owl",
  },
  {
    id: "daily-correct-10",
    type: "daily",
    title: "Sepuluh Tepat",
    description: "Jawab 10 pertanyaan dengan benar hari ini",
    icon: "🎯",
    goal: "answer-correct",
    target: 10,
    reward: 60,
    color: "owl",
  },
  {
    id: "daily-points-100",
    type: "daily",
    title: "Poin Harian",
    description: "Raih 100 poin hari ini",
    icon: "⭐",
    goal: "earn-points",
    target: 100,
    reward: 40,
    color: "bee",
  },
  {
    id: "daily-points-200",
    type: "daily",
    title: "Hunter Poin",
    description: "Raih 200 poin hari ini",
    icon: "💰",
    goal: "earn-points",
    target: 200,
    reward: 80,
    color: "fox",
  },
  {
    id: "daily-streak-3",
    type: "daily",
    title: "Combo Kecil",
    description: "Raih streak 3x jawaban benar",
    icon: "🔥",
    goal: "reach-streak",
    target: 3,
    reward: 30,
    color: "cardinal",
  },
  {
    id: "daily-streak-5",
    type: "daily",
    title: "Combo Api",
    description: "Raih streak 5x jawaban benar",
    icon: "⚡",
    goal: "reach-streak",
    target: 5,
    reward: 50,
    color: "cardinal",
  },
  {
    id: "daily-vocab",
    type: "daily",
    title: "Vocab Master",
    description: "Mainkan 1 game Vocabulary",
    icon: "📖",
    goal: "play-category",
    target: 1,
    reward: 25,
    color: "owl",
  },
  {
    id: "daily-grammar",
    type: "daily",
    title: "Grammar Hero",
    description: "Mainkan 1 game Grammar",
    icon: "✏️",
    goal: "play-category",
    target: 1,
    reward: 25,
    color: "fox",
  },
  {
    id: "daily-conversation",
    type: "daily",
    title: "Talkative",
    description: "Mainkan 1 game Daily Conversation",
    icon: "💬",
    goal: "play-category",
    target: 1,
    reward: 25,
    color: "macaw",
  },
  {
    id: "daily-perfect",
    type: "daily",
    title: "Sempurna Hari Ini",
    description: "Selesaikan 1 game dengan skor sempurna",
    icon: "✨",
    goal: "perfect-game",
    target: 1,
    reward: 100,
    color: "bee",
  },
]

// ===== Daily Mission Generator =====
// Returns 3 random daily missions, deterministic per day (so they don't change on refresh)
export function getDailyMissions(date: Date = new Date()): Mission[] {
  // Seed by date so missions stay same within a day
  const dateStr = date.toDateString()
  let seed = 0
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) & 0x7fffffff
  }

  // Pick 3 different missions from the pool using seeded random
  const pool = [...DAILY_MISSION_POOL]
  const selected: Mission[] = []

  for (let i = 0; i < 3 && pool.length > 0; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    const idx = seed % pool.length
    selected.push(pool[idx])
    pool.splice(idx, 1)
  }

  return selected
}

// ===== Mission Progress Tracking =====
export interface MissionProgress {
  missionId: string
  progress: number
  completed: boolean
  claimed: boolean
  dateKey?: string // for daily missions, format YYYY-MM-DD
}

// Compute mission progress based on player stats + game session data
export interface MissionContext {
  totalGamesPlayed: number
  totalCorrect: number
  totalScore: number
  maxStreak: number
  perfectGames: number
  unlockedAchievementsCount: number
  categoriesPlayed: CategoryId[]
  modesPlayed: string[]
  difficultiesPlayed: Difficulty[]
  differentDaysPlayed: string[] // array of YYYY-MM-DD strings
  // Today-specific (for daily missions)
  todayGamesPlayed: number
  todayCorrect: number
  todayScore: number
  todayMaxStreak: number
  todayPerfectGames: number
  todayCategoriesPlayed: CategoryId[]
  todayDateKey: string
}

export function computeMissionProgress(mission: Mission, ctx: MissionContext): number {
  let current = 0

  if (mission.type === "daily") {
    switch (mission.goal) {
      case "play-games": current = ctx.todayGamesPlayed; break
      case "answer-correct": current = ctx.todayCorrect; break
      case "earn-points": current = ctx.todayScore; break
      case "reach-streak": current = ctx.todayMaxStreak; break
      case "play-category":
        current = ctx.todayCategoriesPlayed.includes(mission.id.includes("vocab") ? "vocabulary" : mission.id.includes("grammar") ? "grammar" : "conversation") ? 1 : 0
        // Better: count distinct categories played today matching mission theme
        if (mission.id === "daily-vocab") current = ctx.todayCategoriesPlayed.includes("vocabulary") ? 1 : 0
        else if (mission.id === "daily-grammar") current = ctx.todayCategoriesPlayed.includes("grammar") ? 1 : 0
        else if (mission.id === "daily-conversation") current = ctx.todayCategoriesPlayed.includes("conversation") ? 1 : 0
        break
      case "perfect-game": current = ctx.todayPerfectGames; break
      default: current = 0
    }
  } else {
    // Main mission
    switch (mission.goal) {
      case "play-games": current = ctx.totalGamesPlayed; break
      case "answer-correct": current = ctx.totalCorrect; break
      case "earn-points": current = ctx.totalScore; break
      case "reach-streak": current = ctx.maxStreak; break
      case "play-category": current = ctx.categoriesPlayed.length; break
      case "play-mode": current = ctx.modesPlayed.length; break
      case "play-difficulty": current = ctx.difficultiesPlayed.length; break
      case "perfect-game": current = ctx.perfectGames; break
      case "earn-achievement": current = ctx.unlockedAchievementsCount; break
      case "play-different-days": current = ctx.differentDaysPlayed.length; break
      default: current = 0
    }
  }

  return Math.min(current, mission.target)
}

export function getMissionColorClass(color: Mission["color"]): { bg: string; text: string; border: string } {
  const map = {
    owl: { bg: "bg-[#d7ffb8]", text: "text-[#58a700]", border: "border-[#58cc02]" },
    macaw: { bg: "bg-[#ddf4ff]", text: "text-[#1899d6]", border: "border-[#1cb0f6]" },
    cardinal: { bg: "bg-[#ffdfe0]", text: "text-[#ea2b2b]", border: "border-[#ff4b4b]" },
    fox: { bg: "bg-[#ffe8cc]", text: "text-[#cc7a00]", border: "border-[#ff9600]" },
    bee: { bg: "bg-[#fff5cc]", text: "text-[#998400]", border: "border-[#ffc800]" },
    beetle: { bg: "bg-[#f0e1ff]", text: "text-[#9b4ddb]", border: "border-[#ce82ff]" },
  }
  return map[color]
}

// ============================================================
// WORLD MAP - Mode Arcade Petualangan Bela
// Bela terbang melintasi kota-kota Indonesia menuju Sekolah Rumbela
// ============================================================

export type LevelType = "normal" | "boss" | "bonus" | "final-exam"
export type CategoryForLevel = CategoryId | "mixed"

export interface LevelNode {
  id: string           // e.g. "jakarta-1"
  worldId: string      // e.g. "jakarta"
  worldName: string    // e.g. "Jakarta"
  levelNumber: number  // 1-10 within world
  type: LevelType
  title: string        // e.g. "Pagi di Jakarta"
  description: string
  // Position on SVG map (percentage 0-100)
  x: number
  y: number
  // What player learns
  category: CategoryForLevel
  difficulty: Difficulty
  // Number of questions in this level
  questionsCount: number
  // Required score to get 3 stars (1 star = pass, 2 stars = good, 3 stars = perfect)
  starThresholds: { one: number; two: number; three: number }
  // Story dialogue shown before level starts
  intro: string
  outro: string
  // Reward on completion (stars + unlock pet on certain levels)
  petReward?: PetType
}

export type PetType = "cat" | "dog" | "rabbit" | "bird" | "hamster"

export interface WorldInfo {
  id: string
  name: string
  icon: string
  description: string
  color: string
  gradient: string
  // SVG position for the world "capital" node (final exam)
  centerX: number
  centerY: number
}

// 5 Worlds (kota-kota Indonesia) - dari rumah menuju sekolah Rumbela
export const WORLDS: WorldInfo[] = [
  {
    id: "jakarta",
    name: "Jakarta",
    icon: "🏙️",
    description: "Berangkat dari rumah di pagi hari",
    color: "#1cb0f6",
    gradient: "from-[#1cb0f6] to-[#1899d6]",
    centerX: 18,
    centerY: 65,
  },
  {
    id: "bandung",
    name: "Bandung",
    icon: "🌄",
    description: "Lewat pegunungan dan taman",
    color: "#58cc02",
    gradient: "from-[#58cc02] to-[#58a700]",
    centerX: 35,
    centerY: 55,
  },
  {
    id: "semarang",
    name: "Semarang",
    icon: "⛵",
    description: "Kota pelabuhan dengan banyak perahu",
    color: "#ffc800",
    gradient: "from-[#ffc800] to-[#cc9c00]",
    centerX: 50,
    centerY: 60,
  },
  {
    id: "surabaya",
    name: "Surabaya",
    icon: "🌊",
    description: "Kota besar dengan jembatan terkenal",
    color: "#ff9600",
    gradient: "from-[#ff9600] to-[#cc6a00]",
    centerX: 70,
    centerY: 58,
  },
  {
    id: "rumbela-school",
    name: "Sekolah Rumbela",
    icon: "🏫",
    description: "Tujuan akhir! Belajar bareng teman-teman",
    color: "#ce82ff",
    gradient: "from-[#ce82ff] to-[#9b4ddb]",
    centerX: 88,
    centerY: 52,
  },
]

// Level nodes for each world - Bela flies from city to city
// Each world has: 6 normal + 1 bonus + 1 boss + 1 final-exam = 9 levels
// (Last world is shorter - just final exam)
export const LEVELS: LevelNode[] = [
  // ===== WORLD 1: JAKARTA =====
  {
    id: "jakarta-1",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 1,
    type: "normal",
    title: "Bangun Pagi",
    description: "Sapaan pagi & perkenalan diri",
    x: 8, y: 75,
    category: "conversation",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🎉 Pagi hari di Jakarta! Bela baru bangun tidur. Ayo bantu Bela menyapa ibunya dan memulai hari!",
    outro: "Kerja bagus! Bela siap berangkat. Sekarang saatnya sarapan dulu.",
    petReward: "cat",  // Lvl 1: unlock pet kucing 🐱
  },
  {
    id: "jakarta-2",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 2,
    type: "normal",
    title: "Sarapan Pagi",
    description: "Nama makanan & minuman",
    x: 14, y: 68,
    category: "vocabulary",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🍳 Bela lapar! Ayo bantu Bela memesan makanan di dapur.",
    outro: "Yummy! Bela sudah kenyang. Sekarang waktunya mandi.",
  },
  {
    id: "jakarta-3",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 3,
    type: "normal",
    title: "Siap Berangkat",
    description: "Pakaian & perlengkapan sekolah",
    x: 20, y: 62,
    category: "vocabulary",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🎒 Bela siap berangkat! Ayo cek tas sekolahnya sudah lengkap belum.",
    outro: "Tas sudah lengkap! Sekarang Bela harus turun ke jalan.",
  },
  {
    id: "jakarta-4",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 4,
    type: "bonus",
    title: "BONUS: Tukang Sayur",
    description: "Mini-game: tebak sayur dengan cepat!",
    x: 16, y: 55,
    category: "vocabulary",
    difficulty: "beginner",
    questionsCount: 6,
    starThresholds: { one: 40, two: 70, three: 100 },
    intro: "🥕 Eh, ada tukang sayur lewat! Bela mau beli buah untuk bekal. Cepat tebak namanya!",
    outro: "Hebat! Bela dapat buah segar untuk bekal.",
  },
  {
    id: "jakarta-5",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 5,
    type: "normal",
    title: "Di Halte Bus",
    description: "Percakapan bertanya arah",
    x: 22, y: 50,
    category: "conversation",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🚌 Bela di halte bus. Ayo tanya arah ke stasiun!",
    outro: "Bela tahu arahnya sekarang. Ayo naik bus!",
  },
  {
    id: "jakarta-6",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 6,
    type: "normal",
    title: "Di Dalam Bus",
    description: "Kalimat perintah & permintaan",
    x: 18, y: 43,
    category: "conversation",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🚏 Bela sudah di dalam bus. Ayo bantu Bela bicara dengan penumpang lain.",
    outro: "Penumpang senang! Bela hampir sampai stasiun.",
  },
  {
    id: "jakarta-7",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 7,
    type: "boss",
    title: "BOSS: Kondektur",
    description: "Percakapan sulit dengan kondektur! Timer cepat!",
    x: 12, y: 38,
    category: "mixed",
    difficulty: "intermediate",
    questionsCount: 6,
    starThresholds: { one: 50, two: 80, three: 110 },
    intro: "👿 Kondektur bus bertanya banyak hal! Bela harus jawab cepat. Jangan gugup!",
    outro: "Wow! Bela berhasil bayar ongkos dan turun di stasiun.",
    petReward: "dog",  // Boss reward: unlock anjing 🐶
  },
  {
    id: "jakarta-final",
    worldId: "jakarta",
    worldName: "Jakarta",
    levelNumber: 8,
    type: "final-exam",
    title: "FINAL: Stasiun Jakarta",
    description: "Ujian akhir dunia Jakarta! Lulus untuk buka Bandung",
    x: 8, y: 32,
    category: "mixed",
    difficulty: "intermediate",
    questionsCount: 8,
    starThresholds: { one: 60, two: 100, three: 140 },
    intro: "🎓 Selamat datang di Stasiun Jakarta! Bela harus lulus ujian ini untuk bisa ke Bandung.",
    outro: "🎉 Luar biasa! Bela lulus ujian Jakarta. Sekarang naik kereta ke Bandung!",
  },

  // ===== WORLD 2: BANDUNG =====
  {
    id: "bandung-1",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 1,
    type: "normal",
    title: "Sampai Bandung",
    description: "Tata bahasa: tenses dasar",
    x: 28, y: 60,
    category: "grammar",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "⛰️ Bela sampai di Bandung! Udara segar pegunungan. Ayo belajar tenses dasar.",
    outro: "Mantap! Bela sudah paham present tense.",
  },
  {
    id: "bandung-2",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 2,
    type: "normal",
    title: "Taman Kota",
    description: "Kata sifat untuk mendeskripsikan",
    x: 34, y: 55,
    category: "vocabulary",
    difficulty: "beginner",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🌳 Bela jalan-jalan di taman kota Bandung. Ayo deskripsikan pemandangan!",
    outro: "Bela bisa mendeskripsikan benda dengan kata sifat sekarang.",
  },
  {
    id: "bandung-3",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 3,
    type: "normal",
    title: "Belanja Souvenir",
    description: "Harga & bilangan",
    x: 40, y: 50,
    category: "conversation",
    difficulty: "intermediate",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🛍️ Bela beli souvenir di Factory Outlet. Ayo belajar bilangan & harga!",
    outro: "Bela dapat diskon! Hemat uang.",
  },
  {
    id: "bandung-4",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 4,
    type: "bonus",
    title: "BONUS: Es Kuy!",
    description: "Mini-game: pesan es kuy dengan ejaan cepat",
    x: 36, y: 45,
    category: "vocabulary",
    difficulty: "intermediate",
    questionsCount: 6,
    starThresholds: { one: 40, two: 70, three: 100 },
    intro: "🍦 Ada penjual es kuy! Bela harus pesan dengan ejaan yang benar. Cepat!",
    outro: "Es kuynya enak! Bela segar kembali.",
  },
  {
    id: "bandung-5",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 5,
    type: "normal",
    title: "Naik Gunung",
    description: "Preposition of place (in/on/at)",
    x: 42, y: 40,
    category: "grammar",
    difficulty: "intermediate",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🏔️ Bela naik ke puncak gunung. Ayo belajar preposition of place!",
    outro: "Bela di puncak! Pemandangan indah.",
  },
  {
    id: "bandung-6",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 6,
    type: "boss",
    title: "BOSS: Pemandu Wisata",
    description: "Bercerita dengan kalimat kompleks",
    x: 36, y: 35,
    category: "mixed",
    difficulty: "intermediate",
    questionsCount: 6,
    starThresholds: { one: 50, two: 80, three: 110 },
    intro: "导游 Pemandu wisata menguji Bela dengan kalimat kompleks!",
    outro: "Bela lulus ujian pemandu wisata! Sekarang ke stasiun Semarang.",
    petReward: "rabbit",  // Boss reward: kelinci 🐰
  },
  {
    id: "bandung-final",
    worldId: "bandung",
    worldName: "Bandung",
    levelNumber: 7,
    type: "final-exam",
    title: "FINAL: Stasiun Bandung",
    description: "Ujian akhir dunia Bandung! Buka jalan ke Semarang",
    x: 32, y: 30,
    category: "mixed",
    difficulty: "intermediate",
    questionsCount: 8,
    starThresholds: { one: 60, two: 100, three: 140 },
    intro: "🎓 Ujian akhir Bandung! Bela harus tunjukkan kemampuan tata bahasanya.",
    outro: "🎉 Hebat! Bela lulus dan kereta melaju ke Semarang.",
  },

  // ===== WORLD 3: SEMARANG =====
  {
    id: "semarang-1",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 1,
    type: "normal",
    title: "Kota Pelabuhan",
    description: "Kosakata transportasi & laut",
    x: 44, y: 65,
    category: "vocabulary",
    difficulty: "intermediate",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "⚓ Bela sampai di Semarang, kota pelabuhan! Ayo belajar kosakata laut.",
    outro: "Bela kenal kapal, perahu, dan pelabuhan sekarang.",
  },
  {
    id: "semarang-2",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 2,
    type: "normal",
    title: "Lawang Sewu",
    description: "Past tense (sejarah)",
    x: 50, y: 60,
    category: "grammar",
    difficulty: "intermediate",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🏛️ Bela mengunjungi Lawang Sewu yang bersejarah. Ayo belajar past tense!",
    outro: "Bela tahu sejarahnya sekarang. Seru!",
  },
  {
    id: "semarang-3",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 3,
    type: "bonus",
    title: "BONUS: Bandeng Boat",
    description: "Mini-game: tangkap ikan bandeng dengan spelling cepat",
    x: 54, y: 55,
    category: "vocabulary",
    difficulty: "intermediate",
    questionsCount: 6,
    starThresholds: { one: 40, two: 70, three: 100 },
    intro: "🐟 Ada perahu nelayan! Bela bantu tangkap ikan dengan ejaan cepat.",
    outro: "Dapat banyak ikan! Bela jago mancing.",
  },
  {
    id: "semarang-4",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 4,
    type: "normal",
    title: "Pasar Semawis",
    description: "Tawar-menawar dalam English",
    x: 58, y: 50,
    category: "conversation",
    difficulty: "advanced",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🏮 Bela ke pasar Semawis di Pecinan. Ayo belajar tawar-menawar!",
    outro: "Bela dapat harga miring! Jago banget.",
  },
  {
    id: "semarang-5",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 5,
    type: "boss",
    title: "BOSS: Nelayan Tua",
    description: "Conditional sentences & narrative",
    x: 54, y: 45,
    category: "mixed",
    difficulty: "advanced",
    questionsCount: 6,
    starThresholds: { one: 50, two: 80, three: 110 },
    intro: "🎣 Nelayan tua bercerita banyak tentang lautan. Bela harus paham kalimat conditional!",
    outro: "Bela paham cerita nelayan. Bijak sekali!",
    petReward: "bird",  // Boss reward: burung 🐦
  },
  {
    id: "semarang-final",
    worldId: "semarang",
    worldName: "Semarang",
    levelNumber: 6,
    type: "final-exam",
    title: "FINAL: Pelabuhan Semarang",
    description: "Ujian akhir dunia Semarang! Buka jalan ke Surabaya",
    x: 50, y: 40,
    category: "mixed",
    difficulty: "advanced",
    questionsCount: 8,
    starThresholds: { one: 60, two: 100, three: 140 },
    intro: "🎓 Ujian akhir Semarang! Bela harus tunjukkan kemampuannya di pelabuhan.",
    outro: "🎉 Bela lulus! Sekarang berlayar ke Surabaya.",
  },

  // ===== WORLD 4: SURABAYA =====
  {
    id: "surabaya-1",
    worldId: "surabaya",
    worldName: "Surabaya",
    levelNumber: 1,
    type: "normal",
    title: "Jembatan Suramadu",
    description: "Vocab teknik & struktur",
    x: 62, y: 65,
    category: "vocabulary",
    difficulty: "advanced",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🌉 Bela lewat Jembatan Suramadu yang megah! Ayo belajar kosakata teknis.",
    outro: "Bela takut ketinggian tapi berhasil lewat.",
  },
  {
    id: "surabaya-2",
    worldId: "surabaya",
    worldName: "Surabaya",
    levelNumber: 2,
    type: "normal",
    title: "Tunjungan Plaza",
    description: "Conversation di mall",
    x: 68, y: 60,
    category: "conversation",
    difficulty: "advanced",
    questionsCount: 5,
    starThresholds: { one: 30, two: 60, three: 90 },
    intro: "🏬 Bela ke mall Tunjungan Plaza. Ayo belajar conversation di mall.",
    outro: "Bela belanja dengan percaya diri!",
  },
  {
    id: "surabaya-3",
    worldId: "surabaya",
    worldName: "Surabaya",
    levelNumber: 3,
    type: "boss",
    title: "BOSS: Sushi Master",
    description: "Detail & nuance dalam bahasa",
    x: 72, y: 55,
    category: "mixed",
    difficulty: "advanced",
    questionsCount: 6,
    starThresholds: { one: 50, two: 80, three: 110 },
    intro: "🍱 Sushi master menguji detail bahasa Bela. Hati-hati dengan nuance!",
    outro: "Bela lulus! Master senang dengan kemampuan Bela.",
    petReward: "hamster",  // Boss reward: hamster 🐹
  },
  {
    id: "surabaya-final",
    worldId: "surabaya",
    worldName: "Surabaya",
    levelNumber: 4,
    type: "final-exam",
    title: "FINAL: Stasiun Surabaya",
    description: "Ujian akhir Surabaya! Terakhir sebelum sampai Rumbela",
    x: 76, y: 50,
    category: "mixed",
    difficulty: "advanced",
    questionsCount: 8,
    starThresholds: { one: 60, two: 100, three: 140 },
    intro: "🎓 Ujian terakhir sebelum sampai Rumbela! Bela harus siap.",
    outro: "🎉 Bela lulus! Sekarang terbang ke sekolah Rumbela!",
  },

  // ===== WORLD 5: SEKOLAH RUMBELA (FINAL WORLD) =====
  {
    id: "rumbela-final",
    worldId: "rumbela-school",
    worldName: "Sekolah Rumbela",
    levelNumber: 1,
    type: "final-exam",
    title: "GRAND FINAL: Upacara Rumbela",
    description: "Ujian akhir agung! Buktikan kemampuanmu di depan semua guru",
    x: 88, y: 52,
    category: "mixed",
    difficulty: "advanced",
    questionsCount: 10,
    starThresholds: { one: 80, two: 130, three: 180 },
    intro: "🏫🎓 Selamat datang di Sekolah Rumbela! Bela harus lulus ujian agung untuk wisuda. Semua guru menonton!",
    outro: "🎓🏆 SELAMAT! Bela resmi lulus dari Rumbela! Kamu adalah juara sejati Bahasa Inggris!",
  },
]

// Pet info
export const PETS: Record<PetType, { emoji: string; name: string; description: string }> = {
  cat: { emoji: "🐱", name: "Mimi", description: "Kucing oren yang suka tidur" },
  dog: { emoji: "🐶", name: "Buddy", description: "Anjing coklat yang setia" },
  rabbit: { emoji: "🐰", name: "Pip", description: "Kelinci putih yang lincah" },
  bird: { emoji: "🐦", name: "Tweety", description: "Burung kuning yang cerewet" },
  hamster: { emoji: "🐹", name: "Coco", description: "Hamster kecil yang menggemaskan" },
}

// Helper: get levels for a world
export function getLevelsByWorld(worldId: string): LevelNode[] {
  return LEVELS.filter((l) => l.worldId === worldId).sort((a, b) => a.levelNumber - b.levelNumber)
}

// Helper: get level by ID
export function getLevelById(id: string): LevelNode | undefined {
  return LEVELS.find((l) => l.id === id)
}

// Helper: get all worlds with their levels
export function getWorldsWithLevels() {
  return WORLDS.map((w) => ({
    world: w,
    levels: getLevelsByWorld(w.id),
  }))
}

// Helper: get all levels flattened (for sequential progression)
export function getAllLevelsFlat(): LevelNode[] {
  const all: LevelNode[] = []
  for (const w of WORLDS) {
    const wLevels = getLevelsByWorld(w.id)
    all.push(...wLevels)
  }
  return all
}
