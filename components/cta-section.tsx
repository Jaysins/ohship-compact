export default function CTASection() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-primary/90 dark:bg-primary/90 text-white rounded-xl p-10 lg:p-16 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">
            Ready to transform your shipping process?
          </h2>
          <p className="text-lg lg:text-xl max-w-3xl">
            Start using ShipLogic today and experience the future of logistics. It's fast, free, and easy to get
            started.
          </p>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-text-primary-light text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
            <span className="truncate">Create Shipment</span>
          </button>
        </div>
      </div>
    </section>
  )
}
