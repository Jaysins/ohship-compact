const testimonials = [
  {
    quote: "A total game-changer for our supply chain. The platform is intuitive, and the support is top-notch.",
    author: "Jane Doe",
    company: "Innovate Corp.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
  },
  {
    quote:
      "The fastest and most reliable platform we've used. Getting instant quotes saves us hours of work every week.",
    author: "John Smith",
    company: "Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
  },
  {
    quote: "Exceptional service and unbeatable quotes. ShipLogic has streamlined our entire logistics operation.",
    author: "Emily White",
    company: "Global Goods",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-background-secondary-light dark:bg-background-secondary-dark py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:gap-12">
          <h2 className="text-text-primary-light dark:text-text-primary-dark text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-center px-4">
            Trusted by Leading Businesses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl bg-background-light dark:bg-background-dark p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-text-primary-light dark:text-text-primary-dark text-base md:text-lg font-medium leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0"
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                  />
                  <div>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-sm md:text-base font-bold">
                      {testimonial.author}
                    </p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs md:text-sm">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
