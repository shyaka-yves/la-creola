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
            className="relative w-full py-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="overflow-hidden px-4 md:px-0">
                <div 
                    ref={containerRef}
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {/* Render in groups of 3 */}
                    {Array.from({ length: totalPages }).map((_, pageIdx) => (
                        <div key={pageIdx} className="flex min-w-full shrink-0 gap-6">
                            {events
                                .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                                .map((event, eventIdx) => (
                                    <div key={eventIdx} className="w-full md:w-1/3">
                                        <article className="card-glass flex h-full flex-col overflow-hidden rounded-3xl border-white/5 transition hover:-translate-y-1">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                <Image
                                                    src={event.imageSrc}
                                                    alt={event.title}
                                                    fill
                                                    className="object-contain transition-transform duration-700 hover:scale-105 bg-black/40"
                                                    unoptimized={event.imageSrc.startsWith("http")}
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            </div>
                                            <div className="flex flex-1 flex-col px-6 pb-10 pt-8">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                                                    {event.date}
                                                </p>
                                                <h3 className="mt-4 text-2xl font-medium tracking-tight text-white line-clamp-1">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-4 text-base leading-relaxed text-zinc-400 font-light line-clamp-2">
                                                    {event.description}
                                                </p>
                                                <Link
                                                    href={event.href}
                                                    className="mt-10 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all"
                                                >
                                                    Learn More
                                                </Link>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            {/* Fill empty spots if less than 3 items on the last page */}
                            {events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length < itemsPerPage && 
                                Array.from({ length: itemsPerPage - events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-full md:w-1/3 hidden md:block" />
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
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-[#EFD077] hover:text-[#EFD077] transition-all lg:-left-16"
                        aria-label="Previous page"
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:border-[#EFD077] hover:text-[#EFD077] transition-all lg:-right-16"
                        aria-label="Next page"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-4">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1 transition-all duration-500 ${
                                index === currentIndex ? "w-12 bg-[#EFD077]" : "w-4 bg-zinc-800"
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
