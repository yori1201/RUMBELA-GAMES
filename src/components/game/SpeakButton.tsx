"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { soundManager } from "@/lib/sound"

interface SpeakButtonProps {
  /** Text to speak */
  text: string
  /** Language code, default "en-US" */
  lang?: string
  /** Speech rate (0.5 - 2.0), default 0.9 (slightly slower for learners) */
  rate?: number
  /** Pitch (0 - 2), default 1 */
  pitch?: number
  /** Volume (0 - 1), default 1 */
  volume?: number
  /** Button size: "sm" | "md" | "lg" */
  size?: "sm" | "md" | "lg"
  /** Variant: "default" | "compact" | "labeled" */
  variant?: "default" | "compact" | "labeled"
  /** Auto-speak when component mounts (for spell mode hint) */
  autoSpeak?: boolean
  /** Custom label for labeled variant */
  label?: string
  /** Disabled state */
  disabled?: boolean
  /** Custom class name */
  className?: string
}

/**
 * SpeakButton - Text-to-Speech button using Web Speech API
 * Reads English text aloud for pronunciation learning.
 * Falls back gracefully if TTS not supported.
 */
export default function SpeakButton({
  text,
  lang = "en-US",
  rate = 0.9,
  pitch = 1,
  volume = 1,
  size = "md",
  variant = "default",
  autoSpeak = false,
  label = "Dengar",
  disabled = false,
  className = "",
}: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window === "undefined") return true
    return "speechSynthesis" in window && !!window.speechSynthesis
  })
  const [hasError, setHasError] = useState(false)
  const autoSpeakRef = useRef(false)

  // Auto-speak on mount (for spell mode reveal, etc.)
  useEffect(() => {
    if (!autoSpeak || autoSpeakRef.current || !isSupported) return
    autoSpeakRef.current = true
    const timer = setTimeout(() => {
      if (!isSupported || disabled || !text) return
      window.speechSynthesis.cancel()
      soundManager.play("click")
      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = rate
        utterance.pitch = pitch
        utterance.volume = volume
        const voices = window.speechSynthesis.getVoices()
        const enVoice =
          voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
          voices.find((v) => v.lang === "en-US") ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0]
        if (enVoice) utterance.voice = enVoice
        utterance.onstart = () => { setIsSpeaking(true); setHasError(false) }
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = (e) => {
          setIsSpeaking(false)
          if (e.error !== "interrupted" && e.error !== "canceled") setHasError(true)
        }
        window.speechSynthesis.speak(utterance)
      } catch {
        setIsSpeaking(false)
        setHasError(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [autoSpeak, isSupported, text, lang, rate, pitch, volume, disabled])

  const speak = useCallback(() => {
    if (!isSupported || disabled || !text) return

    // Stop any ongoing speech first
    window.speechSynthesis.cancel()

    // Small click sound for feedback
    soundManager.play("click")

    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      // Try to find an English voice
      const voices = window.speechSynthesis.getVoices()
      const enVoice =
        voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0]
      if (enVoice) {
        utterance.voice = enVoice
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setHasError(false)
      }
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (e) => {
        setIsSpeaking(false)
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setHasError(true)
        }
      }

      window.speechSynthesis.speak(utterance)
    } catch (err) {
      setIsSpeaking(false)
      setHasError(true)
    }
  }, [text, lang, rate, pitch, volume, isSupported, disabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!isSupported) {
    // Don't render if TTS not supported
    return null
  }

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  if (variant === "labeled") {
    return (
      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={speak}
        disabled={disabled || isSpeaking}
        className={`flex items-center gap-1.5 rounded-xl bg-[#1cb0f6] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white border-2 border-[#1899d6] shadow-[0_3px_0_#1899d6] active:translate-y-0.5 active:shadow-[0_1px_0_#1899d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
        aria-label={`Listen to ${text}`}
      >
        {isSpeaking ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Volume2 className={`${iconSizes[size]} ${isSpeaking ? "animate-pulse" : ""}`} />
        )}
        {label}
        {isSpeaking && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-[10px]"
          >
            🔊
          </motion.span>
        )}
      </motion.button>
    )
  }

  if (variant === "compact") {
    return (
      <motion.button
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={speak}
        disabled={disabled || isSpeaking}
        className={`inline-flex items-center justify-center rounded-full bg-[#1cb0f6] text-white border-2 border-[#1899d6] shadow-[0_2px_0_#1899d6] active:translate-y-0.5 active:shadow-[0_0_0_#1899d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${sizeClasses[size]} ${className}`}
        aria-label={`Listen to ${text}`}
        title={hasError ? "Tap to retry" : "Listen to pronunciation"}
      >
        {isSpeaking ? (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Volume2 className={iconSizes[size]} />
          </motion.div>
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </motion.button>
    )
  }

  // Default variant - circular button with hover glow
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      onClick={speak}
      disabled={disabled || isSpeaking}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#1cb0f6] to-[#1899d6] text-white border-2 border-[#1899d6] shadow-[0_3px_0_#1899d6] active:translate-y-0.5 active:shadow-[0_1px_0_#1899d6] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${sizeClasses[size]} ${className}`}
      aria-label={`Listen to ${text}`}
      title={hasError ? "Tap to retry" : "Listen to pronunciation"}
    >
      {isSpeaking ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Volume2 className={iconSizes[size]} />
        </motion.div>
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}

      {/* Sound waves animation when speaking */}
      {isSpeaking && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#1cb0f6]"
            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#1cb0f6]"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
    </motion.button>
  )
}
