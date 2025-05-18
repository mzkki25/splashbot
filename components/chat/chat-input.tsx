"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatOptionTooltip } from "./chat-option-tooltip"
import { useStore } from "@/lib/store/useStore"
import { useChatActions } from "@/hooks/use-chat-actions"
import { useFileUpload } from "@/hooks/use-file-upload"
import ChatInputForm from "./chat-input-form"
import { useIsMobile } from "@/hooks/use-mobile"

const CHAT_OPTIONS = [
  { label: "General Macroeconomics", value: "General Macroeconomics", disabled: false },
  { label: "2 Wheels", value: "2 Wheels", disabled: false },
  { label: "4 Wheels", value: "4 Wheels", disabled: true },
  { label: "Retail General", value: "Retail General", disabled: true },
  { label: "Retail Beauty", value: "Retail Beauty", disabled: true },
  { label: "Retail FnB", value: "Retail FnB", disabled: true },
  { label: "Retail Drugstore", value: "Retail Drugstore", disabled: true },
]

interface ChatInputProps {
  isLoading: boolean
  inputValue?: string
  setInputValue?: (value: string) => void
}

export default function ChatInput({ isLoading, inputValue = "", setInputValue }: ChatInputProps) {
  const [input, setInput] = useState(inputValue)
  const [inputHeight, setInputHeight] = useState("60px")
  const isMobile = useIsMobile()

  useEffect(() => {
    setInput(inputValue)
  }, [inputValue])

  const { chatOption, setChatOption } = useStore()
  const { handleSendMessage } = useChatActions({
    setInput: (value) => {
      setInput(value)
      if (setInputValue) setInputValue(value)
    },
  })

  const { selectedFile, uploadedFileId, isUploading, fileInputRef, handleFileSelect, handleRemoveFile } =
    useFileUpload()

  const onSendMessage = () => {
    if (isLoading || isUploading || (!input.trim() && !selectedFile)) return
    handleSendMessage(input, uploadedFileId, selectedFile)
    setInputHeight("60px")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInput(newValue)
    if (setInputValue) setInputValue(newValue)

    const textarea = e.target
    textarea.style.height = "60px" 
    const newHeight = Math.min(textarea.scrollHeight, 200) 
    setInputHeight(`${newHeight}px`)
  }

  useEffect(() => {
    const updateSafeArea = () => {
      const safeAreaBottom =
        getComputedStyle(document.documentElement).getPropertyValue("--safe-area-inset-bottom") || "0px"
      document.documentElement.style.setProperty("--safe-area-bottom", safeAreaBottom)
    }

    updateSafeArea()
    window.addEventListener("resize", updateSafeArea)
    return () => window.removeEventListener("resize", updateSafeArea)
  }, [])

  return (
    <div
      className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700"
      style={{ paddingBottom: `calc(1rem + var(--safe-area-bottom, 0px))` }}
    >
      <Card className="max-w-3xl mx-auto dark:bg-gray-800 shadow-sm">
        <div className="p-2">
          <div className="mb-2">
            <div className="flex items-center">
              <Select value={chatOption} onValueChange={setChatOption}>
                <SelectTrigger className={isMobile ? "text-sm py-2" : ""}>
                  <SelectValue placeholder="Select chat option" />
                </SelectTrigger>
                <SelectContent>
                  {CHAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ChatOptionTooltip />
            </div>
          </div>

          <ChatInputForm
            input={input}
            setInput={handleInputChange}
            selectedFile={selectedFile}
            isLoading={isLoading}
            isUploading={isUploading}
            chatOption={chatOption}
            fileInputRef={fileInputRef}
            handleKeyDown={handleKeyDown}
            handleFileSelect={handleFileSelect}
            handleRemoveFile={handleRemoveFile}
            onSendMessage={onSendMessage}
            inputHeight={inputHeight}
          />
        </div>
      </Card>
    </div>
  )
}
