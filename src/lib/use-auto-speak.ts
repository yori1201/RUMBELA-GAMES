"use client"

import { useEffect, useRef } from "react"

interface UseAutoSpeakOptions {
  /** Text to speak */
  text: string
  /** Trigger - speak when this becomes true */
  when: boolean
  /** Unique key to identify the speak session (so it doesn't re-speak on re-render) */
  key: string | number
  /** Language code, default "en-US" */
  lang?: string
  /** Speech rate, default 0.92 (slightly slower for learners, but natural) */
  rate?: number
  /** Delay before speaking (ms), default 500 */
  delay?: number
}

/**
 * Natural voice picker - cached module-level so all hook instances share
 * Priority: Google cloud > Microsoft online > female-named > any matching lang
 */
let cachedNaturalVoice: SpeechSynthesisVoice | null = null
let cachedLang: string = ""
let voicesReadyListeners: Array<() => void> = []

function pickNaturalVoiceForLang(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const langPrefix = lang.toLowerCase().split("-")[0]
  const matchingVoices = voices.filter(
    (v) => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.toLowerCase().startsWith(langPrefix)
  )

  // Priority order (most natural first):
  // 1. Google cloud voices (online, neural) - paling natural di mayoritas browser
  // 2. Microsoft Online Natural voices (Zira, Mark, Gadis, Ardi, dll.)
  // 3. Apple/Siri voices (kalau di iOS/macOS)
  // 4. Female-named voices (biasanya lebih natural untuk edukasi anak)
  // 5. Any matching voice
  const isLangMatch = (v: SpeechSynthesisVoice) =>
    v.lang.toLowerCase() === lang.toLowerCase() || v.lang.toLowerCase().startsWith(langPrefix)

  const predicates: Array<(v: SpeechSynthesisVoice) => boolean> = [
    (v) => isLangMatch(v) && v.name.includes("Google"),
    (v) => isLangMatch(v) && v.name.includes("Microsoft") && /online|natural|zira|mark|gadis|ardi|sonia|guy/i.test(v.name),
    (v) => isLangMatch(v) && v.name.includes("Microsoft") && /natural/i.test(v.name),
    (v) => isLangMatch(v) && v.name.includes("Siri"),
    (v) => isLangMatch(v) && v.name.includes("Apple"),
    (v) => isLangMatch(v) && /female|gadis|sari|damay|ayu|zira|sonia|samantha|karen|moira|tessa/i.test(v.name),
    (v) => isLangMatch(v),
  ]

  for (const predicate of predicates) {
    const found = matchingVoices.find(predicate) || voices.find(predicate)
    if (found) return found
  }
  return matchingVoices[0] || voices[0] || null
}

/**
 * useAutoSpeak - hook to automatically speak text using Web Speech API
 * Triggers when `when` becomes true (e.g., when answer is submitted).
 * Use `key` to ensure it only speaks once per unique session.
 *
 * Voice selection: prefers Google cloud / Microsoft Natural / Siri voices
 * over generic default voices to avoid "robotic" sound. Pitch stays at 1.0
 * (default) instead of being artificially raised.
 *
 * Example:
 *   useAutoSpeak({
 *     text: "apple",
 *     when: showResult,
 *     key: `${currentIdx}`,
 *   })
 */
export function useAutoSpeak({
  text,
  when,
  key,
  lang = "en-US",
  rate = 0.92,
  delay = 500,
}: UseAutoSpeakOptions) {
  const lastSpokenRef = useRef<string>("")

  useEffect(() => {
    if (!when) {
      // Reset tracker when condition becomes false (so next time it's true, it can speak again)
      lastSpokenRef.current = ""
      return
    }
    // Already spoken for this key
    if (lastSpokenRef.current === String(key)) return
    lastSpokenRef.current = String(key)

    const timer = setTimeout(() => {
      if (typeof window === "undefined" || !window.speechSynthesis) return
      if (!text) return

      window.speechSynthesis.cancel()
      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = rate
        // Natural pitch = 1.0. Avoid > 1.0 which causes robotic / chipmunk sound.
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Use cached natural voice if lang matches, else re-pick
        if (cachedLang !== lang || !cachedNaturalVoice) {
          cachedNaturalVoice = pickNaturalVoiceForLang(lang)
          cachedLang = lang
        }
        if (cachedNaturalVoice) {
          utterance.voice = cachedNaturalVoice
        }

        window.speechSynthesis.speak(utterance)
      } catch {
        // Silent fail - TTS not supported
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [when, key, text, lang, rate, delay])
}

/**
 * Pre-warm the voice list. Browsers load voices async - if we try to
 * pick a natural voice before voices are ready, we fall back to default.
 * Call this once on app mount (in HomeScreen or layout) to ensure
 * voices are loaded before the user needs TTS.
 */
export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve()
      return
    }
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve()
      return
    }
    // Wait for voiceschanged event
    const handler = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler)
      voicesReadyListeners.forEach((cb) => cb())
      voicesReadyListeners = []
      resolve()
    }
    window.speechSynthesis.addEventListener("voiceschanged", handler)
    // Safety timeout - resolve after 1s even if event never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler)
      resolve()
    }, 1000)
  })
}
