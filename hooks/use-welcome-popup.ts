"use client"

import { useState, useEffect } from "react"
const WELCOME_POPUP_SEEN_KEY = "splashbot_welcome_popup_seen"

export function useWelcomePopup() {
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized) return

    const hasSeenWelcomePopup = localStorage.getItem(WELCOME_POPUP_SEEN_KEY) === "true"

    if (!hasSeenWelcomePopup) {
      const timer = setTimeout(() => {
        setIsWelcomePopupOpen(true)
      }, 500)

      return () => clearTimeout(timer)
    }
    setHasInitialized(true)

  }, [hasInitialized])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === WELCOME_POPUP_SEEN_KEY && event.newValue === "true") {
          setIsWelcomePopupOpen(false)
        }
      }

      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  const closeWelcomePopup = () => {
    setIsWelcomePopupOpen(false)

    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_POPUP_SEEN_KEY, "true")
    }
    setHasInitialized(true)
  }

  const setFalseWelcomePopup = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WELCOME_POPUP_SEEN_KEY, "false")
    }
  }

  return {
    isWelcomePopupOpen,
    closeWelcomePopup,
    setFalseWelcomePopup,
    hasInitialized,
  }
}
