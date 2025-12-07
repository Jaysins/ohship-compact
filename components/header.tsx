"use client"

import Link from "next/link"
import { useState } from "react"
import { useBranding } from "@/hooks/use-branding"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { branding } = useBranding()

  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={branding.name} className="h-8 md:h-10 w-auto" />
            ) : (
              <>
                <span className="text-primary text-2xl md:text-3xl">🚚</span>
                <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg md:text-xl font-bold">
                  {branding.name}
                </h2>
              </>
            )}
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors"
              href="#contact"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/track"
              className="hidden sm:block text-text-primary-light dark:text-text-primary-dark font-bold hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base"
            >
              Track
            </Link>
            <Link
              href="/create-shipment"
              className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 md:h-11 px-4 md:px-5 bg-primary text-white text-sm md:text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Fetch Quotes</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors py-2"
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors py-2"
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary font-medium transition-colors py-2"
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex flex-col gap-3 pt-2 border-t border-gray-200 dark:border-gray-800 sm:hidden">
              <Link
                href="/track"
                className="text-center py-3 text-text-primary-light dark:text-text-primary-dark font-bold hover:text-primary dark:hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Shipment
              </Link>
              <Link
                href="/create-shipment"
                className="flex items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Shipment
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
