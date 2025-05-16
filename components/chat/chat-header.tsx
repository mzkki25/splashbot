"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/handler/theme-toggle"
import Image from "next/image"
import { useWelcomePopup } from "@/hooks/use-welcome-popup"

interface ChatHeaderProps {
  onLogout: () => void
}

export default function ChatHeader({ onLogout }: ChatHeaderProps) {
  const { setFalseWelcomePopup } = useWelcomePopup()

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2"></div>
      <div className="flex items-center gap-2">
        <Image
          src="/splashbot-logo.png"
          alt="SPLASHBot Logo"
          width={40}
          height={40}
          className="rounded-md"
        />
        <span className="text-xl font-bold text-gray-800 dark:text-white">SPLASHBot</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setFalseWelcomePopup()
            onLogout()
          }}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
