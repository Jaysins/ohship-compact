"use client"

import { useEffect } from 'react'
import { ThemeConfig } from '@/config/theme'
import { ThemeContextProvider } from '@/contexts/theme-context'

/**
 * Converts hex color to RGB values for CSS variables
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'

  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * Generates CSS variables from theme config
 */
function generateThemeVariables(theme: ThemeConfig) {
  return {
    '--color-primary': hexToRgb(theme.theme.primary_color),
    '--color-secondary': theme.theme.secondary_color ? hexToRgb(theme.theme.secondary_color) : hexToRgb(theme.theme.primary_color),
    '--color-success': hexToRgb(theme.theme.success_color),
    '--color-warning': hexToRgb(theme.theme.warning_color),
    '--color-danger': hexToRgb(theme.theme.danger_color),
    '--color-info': theme.theme.info_color ? hexToRgb(theme.theme.info_color) : hexToRgb(theme.theme.primary_color),
    '--font-family': theme.theme.font_family,
    '--border-radius': getBorderRadiusValue(theme.theme.border_radius || 'lg'),
  }
}

/**
 * Maps border radius config to CSS values
 */
function getBorderRadiusValue(radius: string): string {
  const radiusMap: Record<string, string> = {
    'none': '0',
    'sm': '0.25rem',
    'md': '0.5rem',
    'lg': '0.75rem',
    'xl': '1rem',
  }
  return radiusMap[radius] || radiusMap.lg
}

/**
 * BrandThemeProvider Component
 * Applies brand CSS variables to the document root
 * Theme is passed from server-side (already fetched)
 */
export function BrandThemeProvider({
  children,
  theme
}: {
  children: React.ReactNode
  theme: ThemeConfig
}) {
  useEffect(() => {
    const variables = generateThemeVariables(theme)

    // Apply CSS variables to root
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })

    // Load custom font if specified
    if (theme.theme.font_url) {
      const link = document.createElement('link')
      link.href = theme.theme.font_url
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }

    // Update favicon if specified
    if (theme.branding.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = theme.branding.favicon_url
      }
    }

    // Update page title
    document.title = `${theme.branding.name} - ${theme.branding.tagline}`
  }, [theme])

  return (
    <ThemeContextProvider theme={theme}>
      {children}
    </ThemeContextProvider>
  )
}
