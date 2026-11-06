# RUMBELA GAMES — Phase 0 Audit Baseline

**Tanggal audit:** 6 November 2026
**Branch audited:** `main`
**Commit:** `7e14ce0` (refactor: antislop audit)
**PRD referensi:** `RUMBELA_GAMES_ADAPTIVE_PRD_v1.md`

Dokumen ini adalah baseline teknis sebelum migrasi ke adaptive learning platform. Dibuat sesuai PRD Section 16 Phase 0.

---

## 1. Teknologi terverifikasi

| Area | Versi | Sumber verifikasi |
|------|-------|-------------------|
| Next.js | 16.1.3 (Turbopack) | `package.json` |
| TypeScript | 5.x | `package.json` |
| React | 19 | `package.json` |
| Tailwind CSS | 4 | `package.json` |
| shadcn/ui | installed | `src/components/ui/` |
| Framer Motion | installed | `package.json` |
| Zustand | installed | `src/lib/game-store.ts` |
| Prisma | 6.11.1 | `package.json` |
| Database provider | **SQLite** | `prisma/schema.prisma` |
| Upstash Redis | installed & used | `src/lib/access-store.ts` |
| next-auth | 4.24.11 | `package.json` (belum terpakai di source) |
| Deployment | Vercel | `https://rumbela.vercel.app/` (HTTP 200 verified) |

## 2. Kondisi database saat ini

`prisma/schema.prisma` hanya punya model generik `User` dan `Post` (template starter). Tidak ada model:
- Student / AccessIdentity / Tutor / AdminUser
- Subject / GradeBand / Domain / Competency / GameLevel
- Question / QuestionExposure
- GameSession / AnswerAttempt / MasteryEvent
- StudentCompetencyProgress / StudentLevelProgress
- StudentReward / StudentXPEvent
- AuditLog

Database file: `db/custom.db` (SQLite local). **Tidak ada credentials PostgreSQL di environment** — PRD rekomendasi PostgreSQL managed belum dapat diimplentasikan tanpa provider credentials.

## 3. Kondisi API routes

Hanya 2 route aktif:
- `POST/GET /api/access` — validasi access code (Upstash Redis)
- `POST/GET/DELETE /api/admin/codes` — CRUD access code (admin)

Belum ada endpoint untuk: student profile, subjects, learning path, game sessions, answer attempts, tutor, admin content.

## 4. Temuan keamanan kritis

### 4.1 Admin password di client bundle (CRITICAL)

`src/components/game/AdminPanel.tsx:31`:
```ts
const DEFAULT_ADMIN_PASSWORD = "rumbela-admin-2026"
```

String literal ini **ter-bundle ke JavaScript yang dikirim ke browser siswa**. Siapapun yang membuka DevTools bisa membaca password admin. Server-side check di `/api/admin/codes` menggunakan `process.env.ADMIN_PASSWORD || "rumbela-admin-2026"` — fallback default juga lemah.

**Mitigasi wajib sebelum P1 release:**
- Hapus `DEFAULT_ADMIN_PASSWORD` dari client bundle
- Set `ADMIN_PASSWORD` sebagai env var wajib di Vercel (no default)
- Implement server-side session/token untuk admin (bukan password di header tiap request)

### 4.2 Access code disimpan di localStorage

`src/lib/access-store.ts` menyimpan `deviceToken` di localStorage browser. Mekanisme ini:
- Tidak cross-device (PRD requirement)
- Bisa dimanipulasi client-side
- Tidak ada expiration/rotation

### 4.3 Progress 100% di localStorage

`src/lib/game-store.ts` menyimpan 7+ key di localStorage:
- `rumbela-player-name`
- `rumbela-stats` (ExtendedStats)
- `rumbela-achievements`
- `rumbela-leaderboard`

**Implikasi:** progress hilang jika:
- Siswa ganti HP/browser
- Clear cache
- Private mode

PRD Section 1明确 menyatakan: "Cross-device: progres tersimpan di server dan dapat dilanjutkan setelah login dari perangkat lain."

## 5. Tech debt teridentifikasi

| ID | Lokasi | Deskripsi | Impact |
|----|--------|-----------|--------|
| TD-001 | `src/app/page.tsx:126-139` | Math dipaksa ke `category=vocabulary, difficulty=beginner` supaya masuk fungsi `recordGameResult` lama | Skor math salah terkategori di leaderboard |
| TD-002 | `src/components/game/AdminPanel.tsx:31` | Admin password hardcoded di client bundle | Keamanan kritis |
| TD-003 | `src/lib/game-store.ts:225-260` | 7 key localStorage untuk state berbeda, tidak atomic | Race condition saat multi-tab |
| TD-004 | `src/app/api/admin/codes/route.ts:17` | `process.env.ADMIN_PASSWORD \|\| "rumbela-admin-2026"` fallback lemah | Password default jika env var tidak set |
| TD-005 | `package.json` script `db:push` | `prisma db push --accept-data-loss` berbahaya jika dipakai di production | Data loss risk |
| TD-006 | `src/lib/access-store.ts` | Tidak ada rate limiting di access code validation | Brute force risk |
| TD-007 | `src/components/game/HomeScreen.tsx:540` | Footer masih bilang "© 2026 Rumbela · Rumah belajar Anak · RUMBELA GAMES" tapi README masih "Rumbela English Quest" | Inkonsistensi dokumentasi |

## 6. Fitur existing yang DIPERTAHANKAN (PRD Section 2.2)

Berikut aset/modul yang **tidak boleh dihapus** selama migrasi:

- Logo Rumbela (`public/rumbela/logo-full.png`)
- Maskot Bela (`public/rumbela/mascot-bela-animated.webp`)
- AnimatedBackground, Confetti, soundManager, Mascot reaction
- QuizMode, WordMatchMode, FillBlankMode, SpellMode (English)
- MathMode (3 level: TK/SD/SMP)
- 361 soal existing (game-data.ts + questions-extra.ts + math-data.ts)
- HUD, ResultScreen, Mascot
- Achievement, Mission, Leaderboard (perlu re-architecting tapi konten dipertahankan)
- AccessGate + AdminPanel (perlu security hardening)

## 7. Aset & file yang akan dihapus

- `examples/` folder (template websocket, tidak terpakai)
- `scripts/extract-logo.ts`, `extract-mascot.ts`, `generate-frames.ts`, `make-gif.py`, `optimize-webp.py`, `remove-bg.py`, `remove-black-bg.py`, `fix-webp-bg.py` — one-off scripts yang sudah selesai dipakai
- `prisma/schema.prisma` model `User` & `Post` (template starter, ganti dengan schema baru)

## 8. Risk register

| Risiko | Severity | Mitigasi |
|--------|----------|----------|
| SQLite tidak cocok untuk production serverless | High | Pakai PostgreSQL managed (Neon/Supabase/Vercel Postgres) — perlu credentials dari user |
| Admin password leak di client | Critical | Hapus di Phase 1, wajib sebelum publish ke production |
| Progress localStorage hilang saat migrasi | High | Buat import/migration tool sebelum deprecate localStorage |
| Bank soal belum dipetakan ke Competency | Medium | Mapping manual di Phase 2, mark legacy sebagai `needs_mapping` |
| Coding/Logic belum ada implementasi | Medium | Tampilkan "Segera hadir" di dashboard sampai Phase 5 selesai |
| Rate limiting belum ada | Medium | Tambah di Phase 7 hardening |

## 9. Regression checklist (wajib tetap berfungsi)

Setelah Phase 1, fitur berikut **harus tetap jalan**:

- [ ] Siswa bisa masuk dengan access code yang sudah ada
- [ ] Siswa lama yang sudah login tidak perlu re-onboard (jika profile sudah lengkap)
- [ ] Quiz, Word Match, Fill Blank, Spell Master bisa dimainkan
- [ ] Math Adventure (TK/SD/SMP) bisa dimainkan
- [ ] Achievement, leaderboard, streak tetap tampil
- [ ] Admin Panel tetap accessible di `/?admin=1` (selama belum di-replace)
- [ ] TTS natural voice di semua mode tetap berfungsi
- [ ] Confetti & sound effects tetap jalan

## 10. Acceptance criteria Phase 0

- [x] Audit teknis final (this document)
- [x] Risk register
- [x] Regression checklist
- [ ] Backup database SQLite (deferred — tidak ada data production signifikan saat ini, hanya dev)
- [ ] Data migration map (akan dibuat saat Phase 2)

## 11. Next steps — Phase 1 scope

Yang akan dikerjakan setelah audit ini:

1. **Prisma schema redesign** — model Student, AccessIdentity, Subject, GradeBand (Phase 2 models akan di-stub)
2. **Student Onboarding UI** — pilih jenjang (TK/PAUD/SD/SMP) + kelas setelah access code valid
3. **Dashboard redesign** — 3 kartu: Matematika, English, Coding/Logic (Coming Soon)
4. **API stubs** — `/api/student/profile`, `/api/student/dashboard` (server-side)
5. **Hapus admin password dari client bundle** (security fix urgent)
6. **Document next phases** di `MIGRATION_PROGRESS.md`

Yang **TIDAK** dikerjakan di Phase 1 (deferred ke Phase 2+):
- PostgreSQL provisioning (butuh credentials dari user)
- Adaptive engine implementation (Phase 3)
- Coding/Logic game (Phase 5)
- Tutor dashboard (Phase 6)
- Content migration & mapping (Phase 2)
- Server-side game session & mastery calculation (Phase 3)
