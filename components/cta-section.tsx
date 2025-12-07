"use client"

import Link from "next/link"
import { useBranding } from "@/hooks/use-branding"

export default function CTASection() {
  const { branding, copy } = useBranding()

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="bg-primary/90 dark:bg-primary/90 text-white rounded-xl p-8 md:p-12 lg:p-16 flex flex-col items-center text-center gap-5 md:gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-2xl">
            Ready to transform your shipping process?
          </h2>

          <p className="text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed">
            Start using {branding.name} today and experience the future of logistics. It's fast, free, and easy to get
            started.
          </p>

          <Link
            href="/create-shipment"
            className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 md:h-14 px-6 md:px-8 bg-white text-text-primary-light text-sm md:text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 hover:scale-105 transition-all active:scale-95"
          >
            <span className="truncate">{copy.cta_button || "Get Started"}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
