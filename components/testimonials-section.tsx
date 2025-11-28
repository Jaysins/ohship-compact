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
    <section className="bg-background-secondary-light dark:bg-background-secondary-dark py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          <h2 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold leading-tight tracking-tight text-center">
            Trusted by Leading Businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl bg-background-light dark:bg-background-dark p-6 shadow-sm"
              >
                <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-medium leading-normal flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                  />
                  <div>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold">
                      {testimonial.author}
                    </p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
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
