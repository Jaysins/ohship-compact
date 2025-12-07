'use client'

import { useThemeContext } from '@/contexts/theme-context'

/**
 * Hook to access branding and theme configuration
 * Uses theme from server-side context
 */
export function useBranding() {
  const theme = useThemeContext()

  return {
    branding: theme.branding,
    copy: theme.copy,
    links: theme.links,
    features: theme.features,
  }
}
