/**
 * Categories API
 * Fetch available item categories for shipment classification
 */

import { apiClient } from './client'
import type { Category, CategoryResponse } from '@/types/category'

export const categoriesApi = {
  /**
   * Get all item categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/')
    return response.data
  },
}
