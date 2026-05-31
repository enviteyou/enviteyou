"use client";

const ratingRows = [
  { stars: 5, label: "5 stars", count: 116, percent: 96 },
  { stars: 4, label: "4 stars", count: 18, percent: 4 },
  { stars: 3, label: "3 stars", count: 12, percent: 0 },
  { stars: 2, label: "2 stars", count: 0, percent: 0 },
  { stars: 1, label: "1 star", count: 0, percent: 0 },
];

const testimonials = [
  {
    initials: "SQ",
    name: "SQ",
    verified: true,
    date: "10/05/2026",
    title: "An incredible invitation",
    rating: 5,
    body:
      "Thanks to the efforts of The Digitalyes, our invitation perfectly reflects what we wanted. The result was beautiful and we are very happy. Highly recommended.",
  },
];

function Stars({ rating = 5, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rating ? "text-[#f4b522]" : "text-black/15"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-y border-black/8 bg-white text-black">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Customer reviews</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-5xl">Customer Reviews</h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Stars rating={5} className="text-3xl leading-none sm:text-4xl" />
            <p className="text-2xl font-semibold tracking-tight text-black/78 sm:text-[2rem]">4.96 / 5</p>
          </div>
          <p className="mt-3 text-sm text-black/55 sm:text-base">Based on 146 reviews</p>
        </div>

        <div className="mt-10 rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="space-y-4">
            {ratingRows.map((row) => (
              <div key={row.stars} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
                <Stars rating={row.stars} className="text-lg sm:text-xl" />
                <div className="h-4 rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: `${Math.max(row.percent, row.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="w-7 text-right text-sm text-black/55 sm:w-8">{row.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="w-full rounded bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black/90 sm:max-w-3xl">
              Write a review
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[1.4rem] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/6 text-sm font-semibold text-[#6a3137]">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight text-black/86">{testimonial.name}</h3>
                      {testimonial.verified ? (
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/72">
                          Verified
                        </span>
                      ) : null}
                    </div>
                    <Stars rating={testimonial.rating} className="mt-1 text-base" />
                  </div>
                </div>
                <time className="text-sm text-black/48">{testimonial.date}</time>
              </div>

              <h4 className="mt-4 text-xl font-semibold tracking-tight text-black">{testimonial.title}</h4>
              <p className="mt-3 max-w-4xl text-base leading-7 text-black/68">{testimonial.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}