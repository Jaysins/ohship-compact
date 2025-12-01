export default function HeroSection() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-col gap-5 md:gap-6 text-left lg:w-1/2 lg:pr-10">
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Simplify Your Logistics. Get Instant Quotes, Book Shipments Fast.
            </h1>
            <h2 className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-relaxed">
              Enter your shipment details below to compare rates from our global network and book in minutes.
            </h2>
            <div className="flex flex-col sm:flex-row w-full max-w-[560px] rounded-xl shadow-sm overflow-hidden gap-3 sm:gap-0">
              <div className="flex w-full sm:w-auto rounded-xl sm:rounded-none sm:rounded-l-xl overflow-hidden">
                <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-background-secondary-light dark:bg-background-secondary-dark items-center justify-center pl-4 border border-r-0 sm:border-y sm:border-l border-gray-200 dark:border-gray-700">
                  <span className="text-lg">🔍</span>
                </div>
                <input
                  className="flex w-full flex-1 resize-none overflow-hidden text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-inset border border-l-0 sm:border-y border-gray-200 dark:border-gray-700 bg-background-secondary-light dark:bg-background-secondary-dark h-12 sm:h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 text-sm md:text-base font-normal leading-normal"
                  placeholder="Origin, destination, shipment details"
                  type="text"
                />
              </div>
              <div className="flex items-center justify-center sm:rounded-r-xl bg-background-secondary-light dark:bg-background-secondary-dark sm:pr-2 border-0 sm:border-y sm:border-r border-gray-200 dark:border-gray-700">
                <button className="w-full sm:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-sm md:text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity active:scale-95">
                  <span className="truncate">Fetch Quotes</span>
                </button>
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 aspect-video bg-cover bg-center rounded-xl shadow-md"
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
