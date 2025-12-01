export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Enter Details",
      description: "Provide your shipment's origin, destination, and dimensions.",
    },
    {
      number: 2,
      title: "Compare Quotes",
      description: "Instantly see competitive rates from our trusted carrier network.",
    },
    {
      number: 3,
      title: "Book Shipment",
      description: "Select the best option and book your shipment with one click.",
    },
  ]

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:gap-12 items-center">
          <div className="flex flex-col gap-4 max-w-3xl text-center px-4">
            <h2 className="text-text-primary-light dark:text-text-primary-dark text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg leading-relaxed">
              Shipping has never been this easy. Follow our straightforward process to manage your logistics
              effortlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 w-full max-w-5xl">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 text-primary text-2xl md:text-3xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg md:text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm md:text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
