export default function HeroSection() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-6 text-left lg:w-1/2 lg:pr-10">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Simplify Your Logistics. Get Instant Quotes, Book Shipments Fast.
            </h1>
            <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal md:text-lg">
              Enter your shipment details below to compare rates from our global network and book in minutes.
            </h2>
            <div className="flex w-full max-w-[560px] rounded-xl shadow-sm overflow-hidden">
              <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-background-secondary-light dark:bg-background-secondary-dark items-center justify-center pl-4 border-y border-l border-gray-200 dark:border-gray-700">
                <span>🔍</span>
              </div>
              <input
                className="flex w-full flex-1 resize-none overflow-hidden text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset border-y border-gray-200 dark:border-gray-700 bg-background-secondary-light dark:bg-background-secondary-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 text-base font-normal leading-normal"
                placeholder="Origin, destination, shipment details"
                type="text"
              />
              <div className="flex items-center justify-center rounded-r-xl border-l-0 bg-background-secondary-light dark:bg-background-secondary-dark pr-2 border-y border-r border-gray-200 dark:border-gray-700">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                  <span className="truncate">Fetch Quotes</span>
                </button>
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 aspect-video bg-cover bg-center rounded-xl"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1578575437980-04aa37127db6?w=800&h=450&fit=crop")',
            }}
          />
        </div>
      </div>
    </section>
  )
}
