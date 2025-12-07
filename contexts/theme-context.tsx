"use client"

import { createContext, useContext } from 'react'
import { ThemeConfig } from '@/config/theme'

const ThemeContext = createContext<ThemeConfig | null>(null)

export function ThemeContextProvider({
  children,
  theme
}: {
  children: React.ReactNode
  theme: ThemeConfig
}) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeConfig {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider')
  }

  return context
}
