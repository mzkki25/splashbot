"use client"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { FileText, ImageIcon, ExternalLink, Bot, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import SafeClientOnly from "@/components/handler/safe-client-only"
import FollowUpQuestions from "@/components/chat/chat-follow-up-question"
import type { ChatMessage as ChatMessageType } from "@/lib/store/chatSessionStore"
import { memo } from "react"
import { useIsMobile } from "@/hooks/useMobile"

interface ChatMessageProps {
  message: ChatMessageType
  onFollowUpQuestionClick?: (question: string) => void
}

const formatUrl = (url: string, isMobile: boolean): string => {
  try {
    const urlObj = new URL(url)
    if (isMobile) {
      const path = urlObj.pathname.length > 15 ? urlObj.pathname.substring(0, 15) + "..." : urlObj.pathname
      return `${urlObj.hostname}${path}`
    } else {
      if (url.length > 100) {
        return url.substring(0, 100) + "..."
      }
      return url
    }
  } catch (e) {
    return isMobile ? url.substring(0, 15) + "..." : url
  }
}

const ChatMessage = memo(function ChatMessage({ message, onFollowUpQuestionClick }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isMobile = useIsMobile()

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} dark:bg-gray-900`} data-role={message.role}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} gap-3 max-w-[80%] sm:max-w-[80%] max-w-[90%]`}>
        <Avatar
          className={`h-8 w-8 ${isUser ? "bg-blue-500" : "bg-green-500"} flex items-center justify-center flex-shrink-0`}
        >
          {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
        </Avatar>
        <div className="w-full overflow-hidden">
          <Card className={`p-3 ${isUser ? "bg-blue-50 dark:bg-blue-900/40" : "bg-white dark:bg-gray-800"}`}>
            {message.file && (
              <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                {message.file.type?.includes("pdf") ? (
                  <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                )}
                <span className="text-xs truncate max-w-[200px]">
                  {message.file.name} {message.file.size && `(${(message.file.size / 1024).toFixed(2)} KB)`}
                </span>
              </div>
            )}
            <div className="w-full break-words">
              {isUser ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      pre: ({ node, ...props }) => (
                        <pre className="overflow-x-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-md my-4" {...props} />
                      ),
                      code: (props) => {
                        const { inline, ...rest } = props as React.ComponentProps<'code'> & { inline?: boolean }
                        return inline ? (
                          <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm" {...rest} />
                        ) : (
                          <code {...rest} />
                        )
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto">
                          <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props} />
                        </div>
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 dark:text-blue-400 break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* References section - Improved for mobile */}
            {message.references && message.references.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">References:</p>
                <div className={`${isMobile ? "grid grid-cols-1 gap-1" : "space-y-1"}`}>
                  {message.references.map((ref, index) => (
                    <div key={index} className="flex items-start">
                      <ExternalLink className="h-3 w-3 mt-0.5 mr-1 inline flex-shrink-0 text-blue-500" />
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline overflow-hidden text-ellipsis"
                        title={ref}
                      >
                        {formatUrl(ref, isMobile)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up questions section */}
            {message.follow_up_question && message.follow_up_question.length > 0 && (
              <div className="follow-up-questions-container">
                <FollowUpQuestions
                  questions={message.follow_up_question}
                  onQuestionClick={(question) => {
                    if (onFollowUpQuestionClick) {
                      onFollowUpQuestionClick(question)
                    }
                  }}
                />
              </div>
            )}
          </Card>
          <SafeClientOnly fallback={<div className="text-xs text-gray-500 mt-1 px-1">Loading time...</div>}>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
              {formatDistanceToNow(new Date(message.timestamp), {
                addSuffix: true,
              })}
            </div>
          </SafeClientOnly>
        </div>
      </div>
    </div>
  )
})

export default ChatMessage