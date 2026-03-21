"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "./FadeIn";

type EventItem = {
    title: string;
    description: string;
    date: string;
    imageSrc: string;
    href: string;
};

type Props = {
    events: EventItem[];
};

export function EventCarousel({ events }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
    }, [events.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }, [events.length]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next]);

    if (events.length === 0) return null;

    return (
        <div 
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {events.map((event, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                        <article className="card-glass mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-3xl border-white/5 md:flex-row">
                            <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:w-1/2">
                                <Image
                                    src={event.imageSrc}
                                    alt={event.title}
                                    fill
                                    className="object-contain transition-transform duration-700 hover:scale-105 bg-black/40"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-12">
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                                    {event.date}
                                </p>
                                <h3 className="mt-4 text-3xl font-medium tracking-tight text-white md:text-4xl">
                                    {event.title}
                                </h3>
                                <p className="mt-6 text-base leading-relaxed text-zinc-400 font-light lg:text-lg">
                                    {event.description}
                                </p>
                                <div className="mt-10">
                                    <Link
                                        href={event.href}
                                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {events.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all md:left-6"
                        aria-label="Previous event"
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all md:right-6"
                        aria-label="Next event"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {events.length > 1 && (
                <div className="mt-8 flex justify-center gap-3">
                    {events.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1 rounded-full transition-all duration-500 ${
                                index === currentIndex ? "w-8 bg-[#EFD077]" : "w-2 bg-zinc-800"
                            }`}
                            aria-label={`Go to event ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
