"use client";

import { useState } from "react";
import { FadeIn } from "./FadeIn";

const TESTIMONIALS = [
  {
    quote:
      "Great dinner at la Creola from the starters to the mains. And service on another level.",
    name: "Ismael R.",
    rating: 5,
  },
  {
    quote:
      "A beautiful balance of comfort and sophistication. The tasting menu was a journey through flavors I didn't know I loved.",
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
      <div className="relative mx-auto max-w-4xl">
        <div className="card-glass overflow-hidden rounded-2xl bg-[#030712] px-8 py-12 text-center shadow-2xl border-white/5">
          <div className="relative">
            <p className="text-3xl text-gold/80 mb-6">“</p>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-zinc-300 font-light italic">
              {active.quote}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">{active.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-zinc-500 mt-1">Visited la Creola</p>
              </div>
              <div className="flex items-center gap-1.5 text-gold text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < active.rating ? "text-gold" : "text-zinc-700"}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 flex w-full justify-between px-4 lg:-px-12 pointer-events-none">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-gold hover:text-gold transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-gold hover:text-gold transition-colors"
          >
            ›
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 rounded-full transition-all ${index === activeIndex ? "w-6 bg-gold" : "w-2 bg-zinc-800"
                }`}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

