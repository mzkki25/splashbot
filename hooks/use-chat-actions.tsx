"use client"

import { useRouter } from "next/navigation"
import { useToast } from "../components/ui/use-toast"
import { useStore } from "../lib/store/useStore"
import { chatApi } from "../lib/api/chat"
import { historyApi } from "../lib/api/history"
import {
  clearAuthData,
  getIdToken,
  generateChatSessionId,
  storeCurrentChatSession,
  waitForTokenReady,
} from "../lib/auth"

interface UseChatActionsProps {
  setInput?: (input: string) => void
  setIsMobileMenuOpen?: (isOpen: boolean) => void
}

export function useChatActions({ setInput, setIsMobileMenuOpen }: UseChatActionsProps = {}) {
  const router = useRouter()
  const { toast } = useToast()

  const { currentChat, addMessage, setChatHistory, createNewChat, setIsLoading } = useStore()

  const loadChatHistoryData = async () => {
    if (useStore.getState().isLoading) return

    try {
      setIsLoading(true)
      const idToken = getIdToken()
      if (!idToken) return

      await waitForTokenReady()

      const history = await historyApi.getChatHistory(idToken)

      const formattedHistory = history.map((item) => ({
        id: item.chat_session_id,
        title: item.title,
        timestamp: item.timestamp,
        messages: [], 
      }))

      setChatHistory(formattedHistory)
    } catch (error) {
      console.error("Failed to load chat history:", error)
      toast({
        title: "Error",
        description: "Failed to load chat history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (inputText: string, fileId: string | null = null, file: File | null = null) => {
    if (!inputText.trim() && !fileId) return

    let chatSessionId = currentChat?.id
    if (!chatSessionId) {
      chatSessionId = generateChatSessionId()
      storeCurrentChatSession(chatSessionId)
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: inputText,
      timestamp: new Date().toISOString(),
      file: fileId
        ? {
            id: fileId,
            name: file?.name,
            type: file?.type,
            size: file?.size,
          }
        : undefined,
    }

    addMessage(userMessage)
    if (setInput) setInput("")
    setIsLoading(true)

    try {
      const idToken = getIdToken()
      if (!idToken) {
        throw new Error("Not authenticated")
      }

      await waitForTokenReady()

      const chatRequest: {
        prompt: string
        chat_options: string
        file_id?: string
      } = {
        prompt: inputText,
        chat_options: useStore.getState().chatOption,
      }

      if (fileId) {
        chatRequest.file_id = fileId
      }

      const response = await chatApi.sendChatMessage(chatSessionId, chatRequest, idToken)

      const botResponse = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: response.response,
        timestamp: response.created_at || new Date().toISOString(),
        references: response.references,
        follow_up_question: response.follow_up_question,
      }

      addMessage(botResponse)

      loadChatHistoryData()
    } catch (error: any) {
      console.error("Chat error:", error)

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const idToken = getIdToken()
      if (!idToken) return

      await waitForTokenReady()
      const result = await historyApi.deleteChat(chatId, idToken)

      if (result.success) {
        useStore.getState().deleteChat(chatId)

        toast({
          title: "Chat deleted",
          description: "The chat has been removed from your history.",
        })

        if (currentChat?.id === chatId) {
          createNewChat()
          router.push("/chat")
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error)
      toast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClearAllChats = async () => {
    try {
      const idToken = getIdToken()
      if (!idToken) return

      await waitForTokenReady()
      const result = await historyApi.clearAllChats(idToken)

      if (result.success) {
        useStore.getState().clearAllChats()

        toast({
          title: "All chats cleared",
          description: "Your chat history has been cleared.",
        })

        createNewChat()
        router.push("/chat")
      }
    } catch (error) {
      console.error("Failed to clear chats:", error)
      toast({
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    clearAuthData()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  const handleNewChat = () => {
    createNewChat()

    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    window.location.href = "/chat"
  }

  const handleFollowUpQuestionClick = (question: string) => {
    console.log("Follow-up question handler triggered:", question)

    if (setInput) {
      setInput(question)

      setTimeout(() => {
        handleSendMessage(question)
      }, 200)
    } else {
      handleSendMessage(question)
    }
  }

  return {
    handleSendMessage,
    handleDeleteChat,
    handleClearAllChats,
    handleLogout,
    handleNewChat,
    handleFollowUpQuestionClick,
    loadChatHistoryData,
  }
}
