"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, LogOut, X, Plus, HistoryIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SafeClientOnly from "@/components/handler/safe-client-only"
import type { ChatSession } from "@/lib/store/chatSessionStore"
import { useIsMobile } from "@/hooks/useMobile"
import { useWelcomePopup } from "@/hooks/useWelcomePopup"
import { useStore } from "@/lib/store/useStore"

interface ChatSidebarProps {
  chatHistory: ChatSession[]
  onDeleteChat: (chatId: string) => void
  onClearAllChats: () => void
  onLogout: () => void
  onNewChat: () => void
  onClose?: () => void
}

export default React.memo(function ChatSidebar({
  chatHistory,
  onDeleteChat,
  onClearAllChats,
  onLogout,
  onNewChat,
  onClose,
}: ChatSidebarProps) {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const router = useRouter()
  const isMobile = useIsMobile()
  const { setFalseWelcomePopup } = useWelcomePopup()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const chatId = urlParams.get("id")
      setActiveChatId(chatId)
    }
  }, [])

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId)
    window.location.href = `/chat?id=${chatId}`
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          <span className="text-lg font-semibold">Chat History</span>
        </div>
        {onClose && (
          <>
            <span className="text-lg font-semibold">Chat History</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden" aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button className="w-full flex items-center gap-2 h-10" onClick={onNewChat} aria-label="Start new chat">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History List */}
      <ScrollArea className="flex-1 px-4">
        {chatHistory.length > 0 ? (
          <div className="space-y-2 py-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`
                  relative rounded-md transition-colors
                  ${activeChatId === chat.id ? "bg-blue-100 dark:bg-blue-900/40" : "hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-800"}
                `}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <div
                  className="p-3 pr-10 cursor-pointer"
                  onClick={() => handleChatClick(chat.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Chat: ${chat.title}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleChatClick(chat.id)
                    }
                  }}
                >
                  <div className="font-medium truncate">{chat.title}</div>
                  <SafeClientOnly fallback={<div className="text-xs text-gray-500">Loading date...</div>}>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                    </div>
                  </SafeClientOnly>
                </div>
                {(hoveredChatId === chat.id || isMobile) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    aria-label={`Delete chat: ${chat.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No chat history yet</div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t mt-auto space-y-2">
        {chatHistory.length > 0 && (
          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onClearAllChats}
            aria-label="Clear all chats"
          >
            Clear All Chats
          </Button>
        )}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            setFalseWelcomePopup()
            onLogout()
          }} 
          aria-label="Logout">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
})
