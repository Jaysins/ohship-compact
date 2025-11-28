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
    <section className="bg-background-light dark:bg-background-dark py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 items-center">
          <div className="flex flex-col gap-4 max-w-3xl text-center">
            <h2 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold leading-tight tracking-tight">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
              Shipping has never been this easy. Follow our straightforward process to manage your logistics
              effortlessly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold">{step.title}</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
