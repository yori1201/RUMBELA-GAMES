# RUMBELA GAMES — Migration Progress

Tracking implementasi PRD v1 (`RUMBELA_GAMES_ADAPTIVE_PRD_v1.md`).

**Update terakhir:** 6 November 2026 — Phase 0 + Phase 1 selesai.

---

## Status per Phase

| Phase | Status | Tanggal | Commit |
|-------|--------|---------|--------|
| Phase 0 — Audit & Baseline | ✅ Selesai | 6 Nov 2026 | `pending` |
| Phase 1 — Foundation & Student Profile | ⚠️ Partial (transitional) | 6 Nov 2026 | `pending` |
| Phase 2 — Curriculum & Content Model | ⏳ Belum mulai | — | — |
| Phase 3 — Adaptive Engine Core | ⏳ Belum mulai | — | — |
| Phase 4 — Migrate Math & English | ⏳ Belum mulai | — | — |
| Phase 5 — Coding / Logic Game | ⏳ Belum mulai | — | — |
| Phase 6 — Tutor Dashboard & Reports | ⏳ Belum mulai | — | — |
| Phase 7 — Hardening, QA & Release | ⏳ Belum mulai | — | — |

---

## Yang sudah dikerjakan

### Phase 0 — Audit & Baseline ✅

- [`AUDIT.md`](./AUDIT.md) dibuat dengan temuan teknis lengkap
- Risk register: 10 risiko teridentifikasi
- Regression checklist: 8 fitur yang harus tetap jalan
- Tech debt register: 7 item (TD-001 sampai TD-007)

### Phase 1 — Foundation & Student Profile ⚠️ Partial

**Yang selesai:**
- ✅ Prisma schema baru dengan model `Student` & `AccessIdentity` (aktif)
- ✅ Stub model untuk Phase 2-6 di `prisma/schema.prisma` (commented out, design readiness)
- ✅ `src/lib/curriculum-data.ts` — jenis jenjang (PAUD/TK/SD/SMP/SMA) + kelas + 3 subject catalog
- ✅ `src/components/game/OnboardingScreen.tsx` — 4 step wizard (name → stage → grade → confirm)
- ✅ `src/app/page.tsx` updated: route ke onboarding jika profile belum lengkap (PRD Section 5.2)
- ✅ Profile disimpan di `localStorage.rumbela-student-profile` (transitional)
- ✅ `src/app/api/student/profile/route.ts` (GET + PUT stub) — server-side validation
- ✅ `src/app/api/student/dashboard/route.ts` (GET stub) — return subject catalog
- ✅ HomeScreen: tambah "Subject Dashboard" section dengan 3 kartu (Math/English/Coding-Logic coming soon)
- ✅ Security fix critical: hapus `DEFAULT_ADMIN_PASSWORD` dari client bundle `AdminPanel.tsx`
- ✅ Security fix: hapus fallback `"rumbela-admin-2026"` di server `/api/admin/codes` — sekarang wajib env var

**Yang BELUM selesai di Phase 1 (diangkat ke Phase 2):**
- ❌ PostgreSQL provisioning (butuh credentials dari pemilik produk — Neon/Supabase/Vercel Postgres)
- ❌ Server-side session (HttpOnly cookie) — saat ini masih pakai `localStorage` + header `x-device-token` sebagai transitional pattern
- ❌ Prisma `db:push` dengan schema baru (belum dijalankan karena SQLite masih dipakai dan tidak ada migration tool untuk data lama)
- ❌ Menghapus akses code flow lama (PRD: jangan hapus sebelum mekanisme pengganti terbukti kompatibel)
- ❌ Backfill Student profile untuk siswa existing yang sudah punya akses code tapi belum onboarding

---

## Yang perlu dikerjakan di Phase 2

### Curriculum & Content Model

1. **Uncomment schema models** di `prisma/schema.prisma`:
   - `Subject`, `GradeBand`, `Domain`, `Competency`, `CompetencyPrerequisite`, `GameLevel`, `Question`

2. **Run Prisma migration**:
   ```bash
   # Set DATABASE_URL ke PostgreSQL production di .env
   # Untuk dev: tetap SQLite
   prisma migrate dev --name phase2_curriculum
   ```

3. **Content migration**:
   - Audit semua 361 soal di `game-data.ts` + `questions-extra.ts` + `math-data.ts`
   - Buat mapping table: legacy question ID → new Competency/Level ID
   - Mark soal yang belum punya grade/competency mapping sebagai `needs_mapping`
   - Tutor review sebelum publish

4. **Admin content management UI**:
   - Subject CRUD
   - Competency CRUD
   - Level CRUD
   - Question CRUD dengan preview

5. **Server-side session (replace x-device-token)**:
   - HttpOnly cookie `rumbela_session`
   - Session stored in Redis (Upstash) atau database
   - Migration tool dari localStorage token → server session

---

## Yang perlu dikerjakan di Phase 3

### Adaptive Engine Core

1. Uncomment model `GameSession`, `AnswerAttempt`, `MasteryEvent`, `LearningPath`, `StudentCompetencyProgress`, `StudentLevelProgress`, `StudentReward`, `StudentXPEvent`

2. Implement `src/lib/adaptive-engine.ts`:
   - `startSession(studentId, competencyId, levelId)` → return sessionId + first question
   - `submitAnswer(sessionId, questionId, answer, hintUsed)` → return correct + next question
   - `completeSession(sessionId)` → calculate mastery + adaptive decision
   - Pseudo logic per PRD Section 7.7

3. Mastery calculation (PRD Section 7.6):
   ```
   masteryScore = 0.60 * baseScore + 0.20 * recentPerformance + 0.20 * independentCorrectRate
   ```

4. Idempotency:
   - XP ledger (PRD Section 11.4 `StudentXPEvent`)
   - `@@unique([sourceType, sourceId])` mencegah double XP
   - Client-generated `idempotencyKey` di submit answer

5. Save `engineVersion` + `decisionReason` di setiap session

---

## Yang perlu dikerjakan di Phase 4-7

Lihat PRD Section 16 untuk detail lengkap. Highlights:

- **Phase 4**: Integrate Math & English modes ke session API. Hapus tech debt TD-001 (Math dipaksa ke `vocabulary/beginner`)
- **Phase 5**: Coding/Logic game — modular pattern (susun blok, navigation, debugging)
- **Phase 6**: Tutor dashboard — assignment, summary, recommendations
- **Phase 7**: Security audit, performance, accessibility, cross-device testing, staging UAT, feature flags, rollback plan

---

## Tech debt yang masih outstanding

| ID | Status | Catatan |
|----|--------|---------|
| TD-001 | Open | Math dipaksa ke vocabulary/beginner di `page.tsx:131`. Akan dihilangkan di Phase 4 saat adaptive engine aktif. |
| TD-002 | ✅ Fixed | Admin password dihapus dari client bundle (Phase 1) |
| TD-003 | Open | 7 key localStorage untuk state berbeda. Akan direplace dengan server session di Phase 2. |
| TD-004 | ✅ Fixed | Fallback password dihapus, server kini wajib env var (Phase 1) |
| TD-005 | Open | `db:push --accept-data-loss` masih di package.json scripts. Akan diganti dengan `prisma migrate` di Phase 2. |
| TD-006 | Open | Rate limiting belum ada. Phase 7 hardening. |
| TD-007 | Open | README masih bilang "Rumbela English Quest". Update dokumen di Phase 7. |

---

## Regression checklist (current status)

Setelah Phase 1, fitur berikut masih berfungsi (verified via build success):

- [x] Build sukses (10s, 6 static pages)
- [x] TypeScript: 0 error di file yang diubah
- [ ] Access code flow tetap jalan — manual test di staging needed
- [ ] Siswa lama tetap bisa main tanpa re-onboard — logic sudah benar (cek profile di localStorage), tapi belum manual tested
- [ ] Quiz/Match/Fill/Spell/Math modes tetap jalan — kode tidak diubah, hanya wrapping
- [ ] Admin Panel tetap accessible (perlu set ADMIN_PASSWORD env var di Vercel)
- [ ] TTS natural voice tidak terpengaruh
- [ ] Confetti & sound effects tidak terpengaruh

---

## Environment variables yang perlu di-set di Vercel

Sebelum deploy Phase 1 ke production:

| Variable | Wajib | Catatan |
|----------|-------|---------|
| `UPSTASH_REDIS_REST_URL` | ✅ | Sudah ada |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Sudah ada |
| `ADMIN_PASSWORD` | ✅ **Wajib baru** | Tanpa ini, Admin Panel tidak bisa login (server return 401) |
| `DATABASE_URL` | ⏳ Phase 2 | PostgreSQL managed URL |

**Action item:** Set `ADMIN_PASSWORD` di Vercel sebelum deploy commit Phase 1. Tanpa ini, admin tidak bisa generate access code baru.

---

## Catatan untuk pemilik produk

1. **Phase 1 ini adalah transitional, bukan complete implementation PRD.** Server-side session belum diimplementasi — masih pakai localStorage + header token. Ini karena:
   - Butuh PostgreSQL credentials dari pemilik produk
   - Mekanisme HttpOnly cookie perlu design session store yang aman
   - PRD Section 2.4: "Jangan menghapus access code flow sebelum mekanisme pengganti terbukti kompatibel"

2. **Onboarding flow sudah berfungsi** — siswa baru yang login pertama kali akan diarahkan ke onboarding (pilih jenjang + kelas). Profile disimpan lokal. Saat Phase 2 server session jadi, profile akan di-migrate otomatis.

3. **Subject Dashboard sudah tampil** dengan 3 kartu (Math aktif, English aktif, Coding/Logic "Segera hadir"). Coding/Logic disabled sesuai PRD Section 19 P1.

4. **Security fix urgent sudah dilakukan** — admin password tidak lagi bocor di client bundle. **Tapi ADMIN_PASSWORD env var WAJIB di-set di Vercel** sebelum deploy, kalau tidak admin panel tidak bisa dipakai.

5. **Untuk lanjut ke Phase 2**, pemilik produk perlu:
   - Pilih provider PostgreSQL managed (Neon, Supabase, atau Vercel Postgres)
   - Berikan connection string ke developer
   - Setujui content mapping strategy untuk 361 soal existing

6. **Tidak ada data production yang terpengaruh** — semua perubahan additive, tidak menghapus data lama.
