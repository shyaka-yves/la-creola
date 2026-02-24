"use client";

import { useState } from "react";
import { FadeIn } from "./FadeIn";

const TESTIMONIALS = [
  {
    quote:
      "Every detail at La Creola feels intentional—from the playlists to the plating. Kigali needed a space like this.",
    name: "Imanzi N.",
    rating: 5,
  },
  {
    quote:
      "A beautiful balance of comfort and sophistication. The tasting menu was a journey through flavors I didn’t know I loved.",
    name: "Rachel K.",
    rating: 5,
  },
  {
    quote:
      "Cocktails that would impress any global bar, in a setting that still feels intimately Rwandan.",
    name: "David M.",
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TESTIMONIALS[activeIndex];

  return (
    <FadeIn>
      <div className="card-glass relative overflow-hidden rounded-3xl px-6 py-8 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40" />
        <div className="relative">
          <p className="text-5xl leading-none text-gold/70">“</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-100 sm:text-base">
            {active.quote}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{active.name}</p>
              <p className="mt-0.5 text-xs text-zinc-400">Guest at La Creola</p>
            </div>
            <div className="flex items-center gap-1 text-gold">
              {Array.from({ length: active.rating }).map((_, i) => (
                <span key={i} aria-hidden="true">
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-6 bg-gold" : "w-2 bg-zinc-600"
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                  )
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600/80 text-xs text-zinc-200 hover:border-gold hover:text-gold"
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600/80 text-xs text-zinc-200 hover:border-gold hover:text-gold"
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

