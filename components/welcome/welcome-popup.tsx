"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, List, FileText, Globe, BookOpen } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

interface WelcomePopupProps {
  onClose: () => void
  isOpen: boolean
}

export default function WelcomePopup({ onClose, isOpen }: WelcomePopupProps) {
  const isMobile = useIsMobile()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl"
          >
            <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={onClose}
                aria-label="Close welcome popup"
              >
                <X className="h-5 w-5" />
              </Button>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <Image
                      src="/splashbot-logo.png"
                      alt="SPLASHBot Logo"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Welcome to SPLASHBot</CardTitle>
                    <CardDescription>Your AI assistant for macroeconomics and industry insights</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeatureItem
                      icon={<List className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                      title="Topic Selection"
                      description="Choose from various specific topics for targeted insights"
                    />
                    <FeatureItem
                      icon={<BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                      title="Suggested Questions"
                      description="Get recommended questions to help you start conversations"
                    />
                    <FeatureItem
                      icon={<Globe className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                      title="Interactive Responses"
                      description="Follow-up questions, references, and topic-specific answers"
                    />
                    <FeatureItem
                      icon={<FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                      title="Document Analysis"
                      description="Upload PDFs and images for AI-powered analysis"
                    />
                  </div>
                </section>

                <section className={isMobile ? "hidden sm:block" : "block"}>
                  <h3 className="text-lg font-semibold mb-3">How to Use</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        1
                      </span>
                      <span>
                        If you're unsure what to ask, select from the initial recommended questions that appear in a new
                        chat
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        2
                      </span>
                      <span>
                        Choose a specific topic from the dropdown menu to get specialized insights for your conversation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        3
                      </span>
                      <span>
                        Upload PDFs or images in the General Macroeconomics topic to ask questions about their content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                        4
                      </span>
                      <span>Click "New Chat" anytime to start a fresh conversation</span>
                    </li>
                  </ul>
                </section>
              </CardContent>

              <CardFooter>
                <Button className="w-full" onClick={onClose}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
}
