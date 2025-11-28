/**
 * Quotes API
 * Fetch shipping quotes based on origin, destination, and package details
 */

import { apiClient } from './client'
import type { Quote, QuoteRequest, QuoteResponse } from '@/types/quote'

export const quotesApi = {
  /**
   * Fetch shipping quotes
   */
  fetchQuotes: async (request: QuoteRequest): Promise<Quote[]> => {
    const response = await apiClient.post<Quote[]>('/quotes/', request)
    return response.data
  },
}
