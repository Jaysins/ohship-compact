/**
 * API Client
 * Base HTTP client for making API requests with proper error handling
 */

import { API_CONFIG, getApiHeaders } from '../api-config'
import type { ApiResponse, ApiErrorResponse } from './types'

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number
  code?: string
  data?: any

  constructor(message: string, status: number, code?: string, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}

/**
 * API Client class with retry logic and error handling
 */
class ApiClient {
  private baseURL: string
  private maxRetries: number = 3
  private retryDelay: number = 1000 // 1 second

  constructor() {
    this.baseURL = API_CONFIG.baseURL
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getApiHeaders(),
          ...options.headers,
        },
      })

      // Parse response
      const data = await response.json()

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          data.message || 'An error occurred',
          response.status,
          data.code,
          data.data
        )
      }

      return data
    } catch (error) {
      // Retry on network errors
      if (
        retryCount < this.maxRetries &&
        (error instanceof TypeError || // Network error
          (error instanceof ApiError && error.status >= 500)) // Server error
      ) {
        await this.delay(this.retryDelay * (retryCount + 1))
        return this.request<T>(endpoint, options, retryCount + 1)
      }

      // Re-throw the error
      throw error
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  /**
   * Upload file with FormData
   */
  async upload<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-API-KEY': API_CONFIG.apiKey,
          'X-TENANT-ID': API_CONFIG.tenantId,
          // Do NOT set Content-Type - browser will set it with boundary
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Upload failed',
          response.status,
          data.code,
          data.data
        )
      }

      return data
    } catch (error) {
      throw error
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for testing
export { ApiClient }
