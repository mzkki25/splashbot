"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Loader2, Send, Upload, X } from "lucide-react"
import { useIsMobile } from "@/hooks/useMobile"

interface ChatInputFormProps {
  input: string
  setInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  selectedFile: File | null
  isLoading: boolean
  isUploading: boolean
  chatOption: string
  fileInputRef: React.RefObject<HTMLInputElement>
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: () => void
  onSendMessage: () => void
  inputHeight: string
}

export default function ChatInputForm({
  input,
  setInput,
  selectedFile,
  isLoading,
  isUploading,
  chatOption,
  fileInputRef,
  handleKeyDown,
  handleFileSelect,
  handleRemoveFile,
  onSendMessage,
  inputHeight,
}: ChatInputFormProps) {
  const isMobile = useIsMobile()
  const isDisabled = isLoading || isUploading || (!input.trim() && !selectedFile)

  return (
    <>
      {selectedFile && (
        <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            {selectedFile.type.includes("pdf") ? (
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
            ) : (
              <ImageIcon className="h-5 w-5 text-blue-500 mr-2" />
            )}
            <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-6 w-6" aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Ask about macroeconomics..."
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none dark:bg-gray-700 mobile-text"
          style={{ height: inputHeight }}
          aria-label="Chat message input"
        />
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading || chatOption !== "General Macroeconomics"}
            aria-label="Upload file"
            className={isMobile ? "h-12 w-12" : "h-10 w-10"}
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="application/pdf,image/*"
            className="hidden"
            disabled={chatOption !== "General Macroeconomics"}
            aria-hidden="true"
          />
          <Button
            size="icon"
            type="button"
            onClick={onSendMessage}
            disabled={isDisabled}
            aria-label="Send message"
            className={`${isMobile ? "h-12 w-12" : "h-10 w-10"} ${isDisabled ? "opacity-50" : ""}`}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  )
}
