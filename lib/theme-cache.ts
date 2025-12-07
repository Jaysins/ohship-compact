/**
 * Server-side theme cache with version-based invalidation
 */

import { ThemeConfig } from '@/config/theme'

interface CachedTheme {
  theme: ThemeConfig
  version: number
  cachedAt: number
}

// In-memory cache (survives for the lifetime of the Node.js process)
let themeCache: CachedTheme | null = null

export const THEME_CACHE_CONFIG = {
  ttl: 30 * 60 * 1000, // 30 minutes
  fallbackToDefault: true,
}

/**
 * Get cached theme if valid
 */
export function getCachedTheme(): CachedTheme | null {
  if (!themeCache) return null

  const now = Date.now()
  const age = now - themeCache.cachedAt

  // Cache is still fresh
  if (age < THEME_CACHE_CONFIG.ttl) {
    return themeCache
  }

  // Cache is stale, needs revalidation
  return null
}

/**
 * Set theme in cache
 */
export function setCachedTheme(theme: ThemeConfig, version: number): void {
  themeCache = {
    theme,
    version,
    cachedAt: Date.now(),
  }
}

/**
 * Get current cached version
 */
export function getCachedVersion(): number | null {
  return themeCache?.version || null
}

/**
 * Extend cache TTL if version is unchanged
 */
export function extendCacheIfSameVersion(currentVersion: number): boolean {
  if (!themeCache) return false

  if (themeCache.version === currentVersion) {
    themeCache.cachedAt = Date.now()
    return true
  }

  return false
}

/**
 * Clear cache (useful for testing)
 */
export function clearThemeCache(): void {
  themeCache = null
}
