"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getIdToken, waitForTokenReady } from "@/lib/auth"

interface InitialQuestionsResponse {
  init_questions: string[]
}

export function useInitialQuestions(chatOption: string, shouldFetch = true) {
  const [questions, setQuestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchedForOption = useRef<string | null>(null)

  const fetchInitialQuestions = async (option: string) => {
    if (!shouldFetch) return

    if (fetchedForOption.current === option && questions.length > 0) return

    setIsLoading(true)
    try {
      await waitForTokenReady()

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE
      const url = new URL(`${API_BASE_URL}/init_questions`)
      
      url.searchParams.append("chat_option", option)

      const response = await fetch(url.toString(), {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch initial questions: ${response.status}`)
      }

      const data: InitialQuestionsResponse = await response.json()
      setQuestions(data.init_questions || [])
      fetchedForOption.current = option
    } catch (error) {
      console.error("Error fetching initial questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chatOption && shouldFetch) {
      fetchInitialQuestions(chatOption)
    }
  }, [chatOption, shouldFetch])

  return {
    initialQuestions: questions,
    isLoadingQuestions: isLoading,
    refreshInitialQuestions: () => fetchInitialQuestions(chatOption),
  }
}
