"use client"

import Link from "next/link"
import { useBranding } from "@/hooks/use-branding"

export default function HeroSection() {
  const { copy, branding } = useBranding()

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-12">

          <div className="flex flex-col gap-5 md:gap-6 text-left lg:w-7/12 lg:pr-10">

            <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              {copy.hero_title || "Simplify Your Logistics. Get Instant Quotes, Book Shipments Fast."}
            </h1>

            <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-relaxed">
              {copy.hero_subtitle || "Get started below to compare rates from our global network and book in minutes."}
            </h2>

            <div>
              <Link href="/create-shipment" className="inline-flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm md:text-base px-6 py-3 h-12 hover:opacity-90 transition-opacity active:scale-95">
                {copy.cta_button || "Get Started"}
              </Link>
            </div>
          </div>

          {branding.hero_image_url && (
            <div
              className="w-full lg:w-1/2 aspect-video bg-cover bg-center rounded-xl"
              style={{
                backgroundImage: `url("${branding.hero_image_url}")`,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
