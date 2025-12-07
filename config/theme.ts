/**
 * Theme Configuration
 * Customize your shipping portal's branding and appearance
 */

export interface ThemeConfig {
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
  copy: {
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
}

/**
 * Default OhShip Theme
 */
export const defaultTheme: ThemeConfig = {
  branding: {
    name: "OhShip",
    tagline: "Shipping Made Simple",
    logo_url: null,
    favicon_url: null,
    hero_image_url: "https://images.unsplash.com/photo-1578575437980-04aa37127db6?w=800&h=450&fit=crop",
  },
  theme: {
    primary_color: "#6366f1", // Indigo
    secondary_color: "#8b5cf6", // Purple
    success_color: "#22c55e", // Green
    warning_color: "#f59e0b", // Amber
    danger_color: "#ef4444", // Red
    info_color: "#3b82f6", // Blue
    font_family: "Inter",
    font_url: null,
    border_radius: "lg",
  },
  copy: {
    login_header: "Welcome back",
    login_subtitle: "Sign in to access your shipping portal",
    signup_header: "Create your account",
    signup_subtitle: "Start shipping smarter today",
    support_text: "Need help?",
    support_subtext: "Contact our support team",
    support_button: "Get Support",
    hero_title: "Ship Smarter, Not Harder",
    hero_subtitle: "Compare quotes from top carriers and book your shipment in minutes",
    cta_button: "Get Started",
  },
  links: {
    terms_url: "/terms",
    privacy_url: "/privacy",
    support_url: "mailto:support@ohship.com",
  },
  features: {
    show_support_section: true,
    enable_remember_me: true,
    show_wallet_balance: true,
  },
}

/**
 * Example Alternative Theme - Ocean Blue
 */
export const oceanTheme: ThemeConfig = {
  branding: {
    name: "ShipWave",
    tagline: "Ride the Wave of Fast Shipping",
    logo_url: null,
    favicon_url: null,
    hero_image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=450&fit=crop",
  },
  theme: {
    primary_color: "#0ea5e9", // Sky Blue
    secondary_color: "#06b6d4", // Cyan
    success_color: "#10b981", // Emerald
    warning_color: "#f59e0b", // Amber
    danger_color: "#ef4444", // Red
    info_color: "#3b82f6", // Blue
    font_family: "Inter",
    font_url: null,
    border_radius: "xl",
  },
  copy: {
    login_header: "Dive back in",
    login_subtitle: "Access your shipping dashboard",
    signup_header: "Start your journey",
    signup_subtitle: "Join thousands of happy shippers",
    support_text: "Questions?",
    support_subtext: "We're here to help you succeed",
    support_button: "Contact Support",
    hero_title: "Ocean-Sized Savings on Every Shipment",
    hero_subtitle: "Compare rates, track packages, and ship worldwide with confidence",
    cta_button: "Start Shipping",
  },
  links: {
    terms_url: "/terms",
    privacy_url: "/privacy",
    support_url: "mailto:hello@shipwave.com",
  },
  features: {
    show_support_section: true,
    enable_remember_me: true,
    show_wallet_balance: true,
  },
}

/**
 * Example Alternative Theme - Sunset Orange
 */
export const sunsetTheme: ThemeConfig = {
  branding: {
    name: "ExpressFlow",
    tagline: "Fast. Reliable. Simple.",
    logo_url: "http://localhost:8000/media/default.png",
    favicon_url: null,
    hero_image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=450&fit=crop",
  },
  theme: {
    primary_color: "#f97316", // Orange
    secondary_color: "#ea580c", // Deep Orange
    success_color: "#22c55e", // Green
    warning_color: "#eab308", // Yellow
    danger_color: "#dc2626", // Red
    info_color: "#3b82f6", // Blue
    font_family: "Inter",
    font_url: null,
    border_radius: "md",
  },
  copy: {
    login_header: "Welcome back",
    login_subtitle: "Continue your shipping journey",
    signup_header: "Get started today",
    signup_subtitle: "Your express shipping solution awaits",
    support_text: "Need assistance?",
    support_subtext: "Our team is standing by",
    support_button: "Chat with Us",
    hero_title: "Express Shipping at Lightning Speed",
    hero_subtitle: "Get instant quotes and ship packages anywhere in the world",
    cta_button: "Ship Now",
  },
  links: {
    terms_url: "/terms",
    privacy_url: "/privacy",
    support_url: "https://expressflow.com/support",
  },
  features: {
    show_support_section: true,
    enable_remember_me: false,
    show_wallet_balance: true,
  },
}

/**
 * Active theme - used as fallback when API is unavailable
 */
export const activeTheme: ThemeConfig = defaultTheme

/**
 * Get theme configuration (synchronous - for client-side use)
 * Returns the default theme for hydration
 */
export function getThemeConfigSync(): ThemeConfig {
  return defaultTheme
}

/**
 * Get theme configuration from API (async - for server-side use)
 * Imported from theme-fetcher
 */
export { getThemeConfig } from '@/lib/theme-fetcher'
