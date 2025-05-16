"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

interface InitialQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  isLoading?: boolean
}

export default function InitialQuestions({ questions, onQuestionClick, isLoading = false }: InitialQuestionsProps) {
  if (questions.length === 0 && !isLoading) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-8 px-4"
    >
      <div className="text-center mb-6">
        <HelpCircle className="h-12 w-12 mx-auto mb-4 text-blue-500 opacity-80" />
        <h2 className="text-xl font-semibold mb-2">Tidak yakin harus bertanya apa?</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Berikut adalah beberapa pertanyaan yang dapat membantu Anda memulai percakapan
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-16 animate-pulse bg-gray-100 dark:bg-gray-800"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 h-auto text-left justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all whitespace-normal break-words"
              onClick={() => onQuestionClick(question)}
            >
              <span className="mr-3 text-blue-500 font-bold flex-shrink-0">{index + 1}.</span>
              <span className="line-clamp-3 md:line-clamp-none">{question}</span>
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
