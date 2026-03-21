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
    const containerRef = useRef<HTMLDivElement>(null);

    // Number of items to show at once
    const itemsPerPage = 3;
    
    // Total pages
    const totalPages = Math.ceil(events.length / itemsPerPage);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, totalPages));
    }, [totalPages]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % Math.max(1, totalPages));
    }, [totalPages]);

    useEffect(() => {
        if (!isAutoPlaying || events.length <= itemsPerPage) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next, events.length]);

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
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {/* Render in groups of 3 */}
                    {Array.from({ length: totalPages }).map((_, pageIdx) => (
                        <div key={pageIdx} className="flex min-w-full shrink-0 gap-6 justify-center">
                            {events
                                .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                                .map((event, eventIdx) => (
                                    <div key={eventIdx} className="w-full sm:w-auto sm:max-w-[260px]">
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
                            {/* Fill empty spots */}
                            {events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length < itemsPerPage && 
                                Array.from({ length: itemsPerPage - events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="hidden sm:block w-[260px]" />
                                ))
                            }
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {totalPages > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute -left-2 top-[40%] -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-[#EFD077] hover:text-[#EFD077] transition-all md:-left-12"
                        aria-label="Previous page"
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-2 top-[40%] -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-[#EFD077] hover:text-[#EFD077] transition-all md:-right-12"
                        aria-label="Next page"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1 transition-all duration-500 ${
                                index === currentIndex ? "w-8 bg-[#EFD077]" : "w-2 bg-zinc-800"
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
