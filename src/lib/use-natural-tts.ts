"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * useNaturalTTS - Hook untuk Text-to-Speech dengan voice natural
 *
 * Pilih voice paling natural yang tersedia di browser:
 *   1. Google cloud voice (online, neural) - paling natural
 *   2. Microsoft Online Natural voices (Zira, Mark, Gadis, Ardi, dll.)
 *   3. Siri / Apple voices
 *   4. Female-named voices (lebih natural untuk edukasi anak)
 *   5. Fallback: default voice bahasa tersebut
 *
 * Pitch = 1.0 (default, natural) - tidak pakai pitch artifisial
 * yang bikin suara robotic/chipmunk.
 *
 * Usage:
 *   const speak = useNaturalTTS()
 *   speak("apple")            // English, default rate 0.92
 *   speak("Cari angka 7", "id", 0.9)  // Indonesian
 *   speak.stop()              // cancel ongoing speech
 */

type Lang = "en" | "id" | string

interface SpeakOptions {
  rate?: number  // 0.1 - 10, default 0.92
  pitch?: number // 0 - 2, default 1.0 (natural)
  volume?: number // 0 - 1, default 1
  delay?: number // ms delay before speaking, default 0
}

// Cache module-level supaya voice picker jalan sekali
let cachedVoices: SpeechSynthesisVoice[] = []
let voicesLoaded = false
let voiceCache: Record<string, SpeechSynthesisVoice | null> = {}

function pickNaturalVoiceForLang(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null
  if (!cachedVoices.length) {
    cachedVoices = window.speechSynthesis.getVoices()
    if (!cachedVoices.length) return null
  }

  // Return cached if available
  if (lang in voiceCache) return voiceCache[lang]

  const langLower = lang.toLowerCase()
  const langPrefix = langLower.split("-")[0]
  const matchingVoices = cachedVoices.filter(
    (v) => v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(langPrefix)
  )

  const isLangMatch = (v: SpeechSynthesisVoice) =>
    v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(langPrefix)

  // Priority: most natural first
  const predicates: Array<(v: SpeechSynthesisVoice) => boolean> = [
    // Google cloud voices - paling natural di Chrome
    (v) => isLangMatch(v) && v.name.includes("Google"),
    // Microsoft Online Natural voices
    (v) => isLangMatch(v) && v.name.includes("Microsoft") && /online|natural|zira|mark|gadis|ardi|sonia|guy|damay/i.test(v.name),
    // Any Microsoft Natural
    (v) => isLangMatch(v) && v.name.includes("Microsoft") && /natural/i.test(v.name),
    // Siri / Apple voices (iOS/macOS)
    (v) => isLangMatch(v) && v.name.includes("Siri"),
    (v) => isLangMatch(v) && v.name.includes("Apple"),
    // Female-named voices - biasanya lebih natural untuk edukasi anak
    (v) => isLangMatch(v) && /female|gadis|sari|damay|ayu|zira|sonia|samantha|karen|moira|tessa|veena/i.test(v.name),
    // Any matching voice
    (v) => isLangMatch(v),
  ]

  for (const predicate of predicates) {
    const found = matchingVoices.find(predicate) || cachedVoices.find(predicate)
    if (found) {
      voiceCache[lang] = found
      return found
    }
  }

  const fallback = matchingVoices[0] || cachedVoices[0] || null
  voiceCache[lang] = fallback
  return fallback
}

// Init voice list on module load
if (typeof window !== "undefined" && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices()
  if (!cachedVoices.length) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      cachedVoices = window.speechSynthesis.getVoices()
      voicesLoaded = true
      voiceCache = {} // reset cache since voices changed
    })
  } else {
    voicesLoaded = true
  }
}

export function useNaturalTTS() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const speak = useCallback((text: string, lang: Lang = "en", options: SpeakOptions = {}) => {
    const { rate = 0.92, pitch = 1.0, volume = 1, delay = 0 } = options

    // Cancel any pending speech
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const doSpeak = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return
      if (!text) return

      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = lang === "en" ? "en-US" : lang === "id" ? "id-ID" : lang
        u.rate = rate
        u.pitch = pitch
        u.volume = volume

        // Pick natural voice
        const langCode = u.lang
        let voice = pickNaturalVoiceForLang(langCode)
        // If not found, try without region code (e.g. "en" instead of "en-US")
        if (!voice) voice = pickNaturalVoiceForLang(langCode.split("-")[0])
        if (voice) u.voice = voice

        window.speechSynthesis.speak(u)
      } catch (e) {
        console.warn("TTS error:", e)
      }
    }

    if (delay > 0) {
      timerRef.current = setTimeout(doSpeak, delay)
    } else {
      doSpeak()
    }
  }, [])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { speak, stop }
}

/**
 * Pre-warm voice list. Call once on app mount so voices are ready
 * before user triggers TTS.
 */
export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve()
      return
    }
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      cachedVoices = voices
      voicesLoaded = true
      resolve()
      return
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices()
      voicesLoaded = true
      voiceCache = {}
      window.speechSynthesis.removeEventListener("voiceschanged", handler)
      resolve()
    }
    window.speechSynthesis.addEventListener("voiceschanged", handler)
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler)
      resolve()
    }, 1000)
  })
}
