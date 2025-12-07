/**
 * Server-side theme fetcher with smart caching
 */

import { ThemeConfig, defaultTheme } from '@/config/theme'
import {
  getCachedTheme,
  setCachedTheme,
  getCachedVersion,
  extendCacheIfSameVersion,
} from './theme-cache'
import { themeApi } from './api/theme'
import { ApiError } from './api/client'

/**
 * Transform API response to ThemeConfig
 */
function transformAPIResponse(data: Awaited<ReturnType<typeof themeApi.getConfig>>): ThemeConfig {
  return {
    branding: {
      name: data.branding.name,
      tagline: data.branding.tagline,
      logo_url: data.branding.logo_url,
      favicon_url: data.branding.favicon_url,
      hero_image_url: data.branding.hero_image_url,
    },
    theme: {
      primary_color: data.theme.primary_color,
      secondary_color: data.theme.secondary_color,
      success_color: data.theme.success_color,
      warning_color: data.theme.warning_color,
      danger_color: data.theme.danger_color,
      info_color: data.theme.info_color,
      font_family: data.theme.font_family,
      font_url: data.theme.font_url,
      border_radius: data.theme.border_radius || 'lg',
    },
    copy: {
      login_header: data.content.login_header,
      login_subtitle: data.content.login_subtitle,
      signup_header: data.content.signup_header,
      signup_subtitle: data.content.signup_subtitle,
      support_text: data.content.support_text,
      support_subtext: data.content.support_subtext,
      support_button: data.content.support_button,
      hero_title: data.content.hero_title,
      hero_subtitle: data.content.hero_subtitle,
      cta_button: data.content.cta_button,
    },
    links: {
      terms_url: data.links.terms_url,
      privacy_url: data.links.privacy_url,
      support_url: data.links.support_url,
    },
    features: {
      show_support_section: data.features.show_support_section,
      enable_remember_me: data.features.enable_remember_me,
      show_wallet_balance: data.features.show_wallet_balance,
    },
  }
}

/**
 * Fetch theme version from API (using apiClient with headers)
 */
async function fetchThemeVersion(): Promise<number | null> {
  try {
    const data = await themeApi.getVersion()
    return data.version
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to fetch theme version:', error.status, error.message)
    } else {
      console.error('Error fetching theme version:', error)
    }
    return null
  }
}

/**
 * Fetch full theme from API (using apiClient with headers)
 */
async function fetchFullTheme(): Promise<{ theme: ThemeConfig; version: number } | null> {
  try {
    const data = await themeApi.getConfig()
    const theme = transformAPIResponse(data)

    return {
      theme,
      version: data.version,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Failed to fetch theme:', error.status, error.message)
    } else {
      console.error('Error fetching theme:', error)
    }
    return null
  }
}

/**
 * Get theme configuration with smart caching
 *
 * Strategy:
 * 1. Check cache - if fresh, return immediately
 * 2. Check version endpoint - if version unchanged, extend cache
 * 3. If version changed, fetch full theme and update cache
 * 4. If API fails, fall back to default theme
 */
export async function getThemeConfig(): Promise<ThemeConfig> {
  // Check if cache is still fresh
  const cached = getCachedTheme()
  if (cached) {
    console.log('✓ Theme cache hit (fresh)')
    return cached.theme
  }

  console.log('⟳ Theme cache miss or stale, checking version...')

  // Check current version from API
  const currentVersion = await fetchThemeVersion()

  if (currentVersion !== null) {
    const cachedVersion = getCachedVersion()

    // If we have a cached version and it matches, extend cache
    if (cachedVersion !== null && cachedVersion === currentVersion) {
      console.log('✓ Theme version unchanged, extending cache')
      const extended = extendCacheIfSameVersion(currentVersion)
      if (extended) {
        const extendedCache = getCachedTheme()
        return extendedCache!.theme
      }
    }

    // Version changed or no cache, fetch full theme
    console.log('↻ Theme version changed, fetching full theme...')
    const result = await fetchFullTheme()

    if (result) {
      console.log('✓ Theme fetched successfully, version:', result.version)
      setCachedTheme(result.theme, result.version)
      return result.theme
    }
  }

  // API failed, try to use stale cache if available
  if (cached) {
    console.warn('⚠ API failed, using stale cache')
    return cached.theme
  }

  // No cache and API failed, fall back to default
  console.warn('⚠ API failed and no cache, using default theme')
  return defaultTheme
}
