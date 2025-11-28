/**
 * API Configuration
 * Centralized configuration for API endpoints and headers
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
}

/**
 * Get default headers for API requests
 */
export const getApiHeaders = (additionalHeaders?: Record<string, string>) => {
  return {
    'X-API-KEY': API_CONFIG.apiKey,
    'X-TENANT-ID': API_CONFIG.tenantId,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
}

/**
 * Check if API is configured
 */
export const isApiConfigured = () => {
  return Boolean(API_CONFIG.baseURL && API_CONFIG.apiKey && API_CONFIG.tenantId)
}
