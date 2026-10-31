#!/usr/bin/env python3
"""Generate src/lib/questions-extra.ts - additional questions for game-data.ts"""
import json
from pathlib import Path

# Import dari script sebelumnya (copy paste data)
import sys
sys.path.insert(0, '/home/z/my-project/scripts')
from generate_questions import QUIZ, MATCH, FILL, SPELL

def gen_quiz_arr():
    out = ["export const EXTRA_QUIZ: QuizQuestion[] = ["]
    for q in QUIZ:
        out.append(f'''  {{
    id: "{q[0]}",
    type: "multiple-choice",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    question: {json.dumps(q[3])},
    questionTranslation: {json.dumps(q[4])},
    options: {json.dumps(q[5], ensure_ascii=False)},
    answer: {q[6]},
    explanation: {json.dumps(q[7], ensure_ascii=False)},
    points: {q[8]},
  }},''')
    out.append("]")
    return "\n".join(out)

def gen_match_arr():
    out = ["export const EXTRA_MATCH: MatchQuestion[] = ["]
    for q in MATCH:
        pairs_str = ",\n      ".join(f'{{ en: {json.dumps(p["en"])}, id: {json.dumps(p["id"], ensure_ascii=False)} }}' for p in q[3])
        out.append(f'''  {{
    id: "{q[0]}",
    type: "word-match",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    pairs: [
      {pairs_str}
    ],
    points: {q[4]},
  }},''')
    out.append("]")
    return "\n".join(out)

def gen_fill_arr():
    out = ["export const EXTRA_FILL: FillBlankQuestion[] = ["]
    for q in FILL:
        out.append(f'''  {{
    id: "{q[0]}",
    type: "fill-blank",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    sentence: {json.dumps(q[3])},
    translation: {json.dumps(q[4], ensure_ascii=False)},
    options: {json.dumps(q[5], ensure_ascii=False)},
    answer: {q[6]},
    explanation: {json.dumps(q[7], ensure_ascii=False)},
    points: {q[8]},
  }},''')
    out.append("]")
    return "\n".join(out)

def gen_spell_arr():
    out = ["export const EXTRA_SPELL: SpellQuestion[] = ["]
    for q in SPELL:
        out.append(f'''  {{
    id: "{q[0]}",
    type: "spell",
    category: "{q[1]}",
    difficulty: "{q[2]}",
    meaning: {json.dumps(q[3], ensure_ascii=False)},
    hint: {json.dumps(q[4])},
    answer: {json.dumps(q[5])},
    example: {json.dumps(q[6])},
    points: {q[7]},
  }},''')
    out.append("]")
    return "\n".join(out)

header = '''// ============================================================
// Rumbela English Quest - Extra Questions Bank (Phase 2)
// 239 soal tambahan untuk perbanyak bank soal & variasi randomisasi
// Generated: questions-extra.ts
// ============================================================

import type { QuizQuestion, MatchQuestion, FillBlankQuestion, SpellQuestion } from "./game-data"

'''

content = header + "\n\n" + gen_quiz_arr() + "\n\n\n" + gen_match_arr() + "\n\n\n" + gen_fill_arr() + "\n\n\n" + gen_spell_arr() + "\n"

Path("/home/z/my-project/src/lib/questions-extra.ts").write_text(content, encoding="utf-8")
print(f"Generated src/lib/questions-extra.ts ({len(content.splitlines())} lines)")
print(f"  - EXTRA_QUIZ: {len(QUIZ)} soal")
print(f"  - EXTRA_MATCH: {len(MATCH)} soal")
print(f"  - EXTRA_FILL: {len(FILL)} soal")
print(f"  - EXTRA_SPELL: {len(SPELL)} soal")
print(f"  - TOTAL: {len(QUIZ)+len(MATCH)+len(FILL)+len(SPELL)} soal baru")
