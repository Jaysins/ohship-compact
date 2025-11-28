export default function FeaturesSection() {
  const features = [
    {
      icon: "📊",
      title: "Instant Quotes",
      description: "Get competitive pricing from multiple carriers in seconds.",
    },
    {
      icon: "📍",
      title: "Real-time Tracking",
      description: "Monitor your shipments from pickup to delivery with live updates.",
    },
    {
      icon: "🌍",
      title: "Global Network",
      description: "Access a wide range of shipping options across the world.",
    },
  ]

  return (
    <section className="bg-background-secondary-light dark:bg-background-secondary-dark py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center">
            <h2 className="text-text-primary-light dark:text-text-primary-dark tracking-light text-3xl font-bold leading-tight md:text-4xl">
              Everything You Need for Smarter Shipping
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg font-normal leading-normal">
              Our platform is designed to provide efficiency, transparency, and control over your entire shipping
              process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-1 gap-4 rounded-xl bg-background-light dark:bg-background-dark p-6 flex-col text-center items-center shadow-sm"
              >
                <div className="bg-primary/10 rounded-full p-3 mb-2 text-3xl">{feature.icon}</div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
