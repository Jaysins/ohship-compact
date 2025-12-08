"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import type { QuoteResponse } from '@/types/quote'

interface QuoteContextType {
  quoteData: QuoteResponse['data'] | null
  selectedQuoteId: string | null
  setQuoteData: (data: QuoteResponse['data'] | null) => void
  setSelectedQuoteId: (id: string | null) => void
  clearQuoteData: () => void
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteData, setQuoteData] = useState<QuoteResponse['data'] | null>(null)
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)

  const clearQuoteData = () => {
    setQuoteData(null)
    setSelectedQuoteId(null)
  }

  return (
    <QuoteContext.Provider
      value={{
        quoteData,
        selectedQuoteId,
        setQuoteData,
        setSelectedQuoteId,
        clearQuoteData,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}
