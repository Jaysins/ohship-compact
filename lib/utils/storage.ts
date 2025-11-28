/**
 * Storage utilities
 * Type-safe localStorage wrapper with error handling
 */

/**
 * Storage keys enum for type safety
 */
export enum StorageKey {
  SHIPMENT_DRAFT = 'shipment-draft',
  QUOTE_SEARCH = 'quote-search',
  SELECTED_QUOTE = 'selected-quote',
  QUOTES_CACHE = 'quotes-cache',
  LAST_ADDRESSES = 'last-addresses',
}

/**
 * Set item in localStorage with JSON serialization
 */
export const setStorageItem = <T>(key: StorageKey, value: T): void => {
  try {
    if (typeof window === 'undefined') return
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

/**
 * Get item from localStorage with JSON parsing
 */
export const getStorageItem = <T>(key: StorageKey): T | null => {
  try {
    if (typeof window === 'undefined') return null
    const item = localStorage.getItem(key)
    if (!item) return null
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return null
  }
}

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: StorageKey): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
  }
}

/**
 * Clear all localStorage
 */
export const clearStorage = (): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Set item with expiration time
 */
export const setStorageItemWithExpiry = <T>(key: StorageKey, value: T, ttlMinutes: number): void => {
  try {
    if (typeof window === 'undefined') return
    const now = new Date()
    const item = {
      value: value,
      expiry: now.getTime() + ttlMinutes * 60 * 1000,
    }
    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error(`Error saving to localStorage with expiry (${key}):`, error)
  }
}

/**
 * Get item with expiration check
 */
export const getStorageItemWithExpiry = <T>(key: StorageKey): T | null => {
  try {
    if (typeof window === 'undefined') return null
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null

    const item = JSON.parse(itemStr)
    const now = new Date()

    // Check if item has expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }

    return item.value as T
  } catch (error) {
    console.error(`Error reading from localStorage with expiry (${key}):`, error)
    return null
  }
}

/**
 * Get storage size in KB
 */
export const getStorageSize = (): number => {
  try {
    if (typeof window === 'undefined') return 0
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total / 1024 // Convert to KB
  } catch (error) {
    console.error('Error calculating storage size:', error)
    return 0
  }
}
