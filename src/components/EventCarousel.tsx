"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update items per page based on window width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Total possible indices
    const maxIndex = events.length - itemsPerPage;

    const next = useCallback(() => {
        if (events.length <= itemsPerPage) return;
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex, events.length, itemsPerPage]);

    const prev = useCallback(() => {
        if (events.length <= itemsPerPage) return;
        setCurrentIndex((prev) => (prev <= 0 ? Math.max(0, maxIndex) : prev - 1));
    }, [maxIndex, events.length, itemsPerPage]);

    useEffect(() => {
        if (!isAutoPlaying || events.length <= itemsPerPage) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next, events.length, itemsPerPage]);

    if (events.length === 0) return null;

    return (
        <div 
            className="relative w-full py-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="overflow-hidden">
                <div 
                    ref={containerRef}
                    className="flex transition-transform duration-700 ease-in-out gap-6"
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                    }}
                >
                    {events.map((event, eventIdx) => (
                        <div 
                            key={eventIdx} 
                            className="w-full shrink-0 px-2 sm:px-0"
                            style={{ width: `calc(${100 / itemsPerPage}% - ${(gapSize[itemsPerPage] || 0)}px)` }}
                        >
                            <article className="card-glass mx-auto flex h-full w-full flex-col overflow-hidden rounded-3xl transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/60">
                                <div className="relative w-full aspect-[4/5] overflow-hidden">
                                    <Image
                                        src={event.imageSrc}
                                        alt={event.title}
                                        fill
                                        className="object-contain transition-transform duration-700 hover:scale-105 bg-black/20"
                                        unoptimized={event.imageSrc.startsWith("http")}
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </div>
                                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                                        {event.date}
                                    </p>
                                    <h2 className="mt-1.5 text-sm font-semibold text-white">{event.title}</h2>
                                    <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2">{event.description}</p>
                                    <Link
                                        href={event.href}
                                        className="gold-gradient mt-3 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-black shadow-md shadow-yellow-500/25 transition hover:shadow-yellow-400/40"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {events.length > itemsPerPage && (
                <>
                    <button
                        onClick={prev}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-gold hover:text-gold transition-all lg:-left-12"
                        aria-label="Previous event"
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-gold hover:text-gold transition-all lg:-right-12"
                        aria-label="Next event"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {events.length > itemsPerPage && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: events.length - itemsPerPage + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1 transition-all duration-500 ${
                                index === currentIndex ? "w-8 bg-gold" : "w-2 bg-zinc-800"
                            }`}
                            aria-label={`Go to event ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const gapSize: Record<number, number> = {
    1: 0,
    2: 12, // (gap-6 is 24px, so 12px adjustment per item?)
    3: 16  // (gap-6 / 3 * 2? Actually it's simpler)
};
