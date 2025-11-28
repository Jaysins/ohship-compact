/**
 * Formatting utilities
 * Functions for formatting currency, dates, numbers, etc.
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns'

/**
 * Format currency with proper symbol and decimals
 */
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy HH:mm')
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    return 'Invalid date'
  }
}

/**
 * Format weight with unit
 */
export const formatWeight = (weight: number, unit: string = 'kg'): string => {
  return `${weight.toFixed(2)} ${unit}`
}

/**
 * Format dimensions
 */
export const formatDimensions = (
  length: number,
  width: number,
  height: number,
  unit: string = 'cm'
): string => {
  return `${length} × ${width} × ${height} ${unit}`
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as international number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format shipment code for display
 */
export const formatShipmentCode = (code: string): string => {
  return code.toUpperCase()
}

/**
 * Calculate estimated delivery date
 */
export const calculateDeliveryDate = (estimatedDays: number): string => {
  const today = new Date()
  const deliveryDate = new Date(today.setDate(today.getDate() + estimatedDays))
  return formatDate(deliveryDate)
}
