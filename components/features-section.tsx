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
    <section className="bg-background-secondary-light dark:bg-background-secondary-dark py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center px-4">
            <h2 className="text-text-primary-light dark:text-text-primary-dark tracking-light text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Everything You Need for Smarter Shipping
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-relaxed">
              Our platform is designed to provide efficiency, transparency, and control over your entire shipping
              process.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-1 gap-4 rounded-xl bg-background-light dark:bg-background-dark p-6 md:p-8 flex-col text-center items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 rounded-full p-4 mb-2 text-3xl md:text-4xl">{feature.icon}</div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg md:text-xl font-bold leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm md:text-base font-normal leading-relaxed">
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
