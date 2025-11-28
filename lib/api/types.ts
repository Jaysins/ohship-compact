/**
 * Common API response structure
 */
export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  message: string
  code?: string
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  status: 'error'
  code: string
  message: string
  data?: any
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}
