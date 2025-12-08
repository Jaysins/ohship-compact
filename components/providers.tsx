"use client"

import { QuoteProvider } from '@/lib/contexts/quote-context'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QuoteProvider>
      {children}
    </QuoteProvider>
  )
}
