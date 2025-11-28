/**
 * Error handling utilities
 * Centralized error handling and user-friendly error messages
 */

import { toast } from 'sonner'
import { ApiError } from '../api/client'

/**
 * Error codes mapped to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  QUOTE_PRICE_CHANGED: 'The quote price has changed. Please review the new prices.',
  QUOTE_EXPIRED: 'This quote has expired. Please fetch new quotes.',
  INVALID_PAYMENT_METHOD: 'The selected payment method is not valid.',
  PAYMENT_EXPIRED: 'Your payment session has expired. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF, PNG, or JPEG files only.',
  INSUFFICIENT_BALANCE: 'Insufficient wallet balance. Please select a different payment method.',
  AUTHENTICATION_ERROR: 'Your session has expired. Please log in again.',
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
}

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: any): string => {
  // API Error with code
  if (error instanceof ApiError && error.code) {
    return ERROR_MESSAGES[error.code] || error.message
  }

  // API Error without code
  if (error instanceof ApiError) {
    return error.message
  }

  // Network error
  if (error instanceof TypeError) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  // Generic error
  if (error instanceof Error) {
    return error.message
  }

  // Unknown error
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Handle API error with toast notification
 */
export const handleApiError = (error: any): void => {
  const message = getErrorMessage(error)

  // Show toast notification
  toast.error(message, {
    duration: 5000,
  })

  // Log error for debugging
  console.error('API Error:', error)
}

/**
 * Handle API error with custom callback
 */
export const handleApiErrorWithCallback = (error: any, callback: (error: any) => void): void => {
  handleApiError(error)
  callback(error)
}

/**
 * Check if error is a specific type
 */
export const isErrorCode = (error: any, code: string): boolean => {
  return error instanceof ApiError && error.code === code
}

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError || (error instanceof ApiError && !navigator.onLine)
}

/**
 * Check if error is server error (5xx)
 */
export const isServerError = (error: any): boolean => {
  return error instanceof ApiError && error.status >= 500 && error.status < 600
}

/**
 * Check if error is client error (4xx)
 */
export const isClientError = (error: any): boolean => {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

/**
 * Format validation errors from API
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')
}

/**
 * Show success toast
 */
export const showSuccess = (message: string): void => {
  toast.success(message, {
    duration: 3000,
  })
}

/**
 * Show info toast
 */
export const showInfo = (message: string): void => {
  toast.info(message, {
    duration: 3000,
  })
}

/**
 * Show warning toast
 */
export const showWarning = (message: string): void => {
  toast.warning(message, {
    duration: 4000,
  })
}

/**
 * Show error toast
 */
export const showError = (message: string): void => {
  toast.error(message, {
    duration: 5000,
  })
}

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (isClientError(error)) {
        throw error
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
