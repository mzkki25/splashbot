"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FollowUpQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
}

export default function FollowUpQuestions({ questions, onQuestionClick }: FollowUpQuestionsProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  if (!questions || questions.length === 0) {
    return null
  }

  const handleQuestionClick = (question: string, index: number) => {
    setClickedIndex(index)

    if (onQuestionClick) {
      onQuestionClick(question)
    }

    setTimeout(() => {
      setClickedIndex(null)
    }, 1500)
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Question recommendation:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`
              text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 
              dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-300 dark:border-blue-800
              whitespace-normal h-auto py-2 px-3 font-normal cursor-pointer
              transition-all duration-200 ease-in-out
              ${clickedIndex === index ? "opacity-70 pointer-events-none" : ""}
            `}
            onClick={() => handleQuestionClick(question, index)}
            disabled={clickedIndex !== null}
            aria-label={`Ask: ${question}`}
          >
            {clickedIndex === index ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {question}
              </span>
            ) : (
              question
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
