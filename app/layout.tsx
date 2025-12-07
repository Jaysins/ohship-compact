import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ToastProvider } from "@/components/ui/toast-provider"
import { BrandThemeProvider } from "@/components/brand-theme-provider"
import { getThemeConfig } from "@/config/theme"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"] })

// Force dynamic rendering since we fetch theme from API
export const dynamic = 'force-dynamic'

/**
 * Generate metadata dynamically from API theme
 */
export async function generateMetadata(): Promise<Metadata> {
  const theme = await getThemeConfig()

  return {
    title: `${theme.branding.name} - ${theme.branding.tagline}`,
    description: theme.copy.hero_subtitle || "Simplify your logistics with instant quotes, shipment booking, and real-time tracking",
    generator: "v0.app",
    icons: {
      icon: theme.branding.favicon_url || [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch theme from API on server-side
  const theme = await getThemeConfig()

  return (
    <html lang="en">
      <body className={`${manrope.className} font-display antialiased`}>
        <BrandThemeProvider theme={theme}>
          {children}
          <ToastProvider />
          <Analytics />
        </BrandThemeProvider>
      </body>
    </html>
  )
}
