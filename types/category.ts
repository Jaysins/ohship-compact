/**
 * Category type definitions
 */

export interface Category {
  id: string
  name: string
  description: string
  group_tag: string
  hs_code: string
}

export interface CategoryResponse {
  status: 'success' | 'error'
  data: Category[]
}
