import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-primary text-3xl">🚚</span>
            <h2 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold">ShipLogic</h2>
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
          <div className="flex items-center gap-4">
            <Link
              href="/track"
              className="text-text-primary-light dark:text-text-primary-dark font-bold hover:text-primary dark:hover:text-primary transition-colors"
            >
              Track
            </Link>
            <Link
              href="/create-shipment"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Create Shipment</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
