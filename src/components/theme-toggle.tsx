"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const isChecked = theme === 'dark'
  const onCheckedChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Sun className="h-5 w-5 text-gray-500" />
      <Switch
        id="theme-toggle"
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Toggle theme"
      >
        <span
          className={cn(
            "pointer-events-none absolute flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            isChecked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </Switch>
      <Moon className="h-5 w-5 text-gray-400" />
    </div>
  )
}
