"use client"

import { useBranding } from "@/hooks/use-branding"

export default function Footer() {
  const { branding, links } = useBranding()

  return (
    <footer className="bg-background-secondary-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
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
            </div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm md:text-base leading-relaxed">
              {branding.tagline}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 md:col-span-2 lg:col-span-3">
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-3 md:mb-4 text-sm md:text-base">
                Company
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-3 md:mb-4 text-sm md:text-base">
                Resources
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href="#"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-3 md:mb-4 text-sm md:text-base">
                Legal
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href={links.terms_url}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base inline-block py-1"
                    href={links.privacy_url}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} {branding.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors p-2"
              href="#"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors p-2"
              href="#"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
