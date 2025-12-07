/**
 * Theme API
 * Endpoints for fetching theme configuration
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

/**
 * Theme Version Response
 */
interface ThemeVersionData {
  version: number
  updated_at: string
}

/**
 * Theme Configuration Response
 */
interface ThemeConfigData {
  branding: {
    name: string
    tagline: string
    logo_url: string | null
    favicon_url: string | null
    hero_image_url: string | null
  }
  theme: {
    primary_color: string
    secondary_color?: string
    success_color: string
    warning_color: string
    danger_color: string
    info_color?: string
    font_family: string
    font_url: string | null
    border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  }
  content: {
    login_header: string
    login_subtitle: string
    signup_header: string
    signup_subtitle: string
    support_text: string
    support_subtext: string
    support_button: string
    hero_title?: string
    hero_subtitle?: string
    cta_button?: string
  }
  links: {
    terms_url: string
    privacy_url: string
    support_url: string
  }
  features: {
    show_support_section: boolean
    enable_remember_me: boolean
    show_wallet_balance: boolean
  }
  version: number
  id: string
  created_at: string
  updated_at: string
}

/**
 * Theme API endpoints
 */
export const themeApi = {
  /**
   * Get current theme version (lightweight)
   */
  getVersion: async (): Promise<ThemeVersionData> => {
    const response = await apiClient.get<ThemeVersionData>('/theme-config/version/')
    return response.data
  },

  /**
   * Get full theme configuration
   */
  getConfig: async (): Promise<ThemeConfigData> => {
    const response = await apiClient.get<ThemeConfigData>('/theme-config/')
    return response.data
  },
}
