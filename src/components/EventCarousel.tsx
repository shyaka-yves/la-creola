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
                        <div key={pageIdx} className="flex min-w-full shrink-0 gap-6 lg:gap-10">
                            {events
                                .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                                .map((event, eventIdx) => (
                                    <div key={eventIdx} className="w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.66rem)]">
                                        <article className="card-glass group flex h-full flex-col overflow-hidden rounded-[2.5rem] border-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-[#EFD077]/20">
                                            <div className="relative aspect-[4/5] w-full overflow-hidden">
                                                <Image
                                                    src={event.imageSrc}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    unoptimized={event.imageSrc.startsWith("http")}
                                                />
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                            </div>
                                            <div className="flex flex-1 flex-col p-8 lg:p-10 bg-[#020617]/50">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                                                    {event.date}
                                                </p>
                                                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white line-clamp-1 lg:text-2xl">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-4 text-sm leading-relaxed text-zinc-400 font-light line-clamp-3">
                                                    {event.description}
                                                </p>
                                                <div className="mt-auto pt-8">
                                                    <Link
                                                        href={event.href}
                                                        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all w-full"
                                                    >
                                                        LEARN MORE
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            {/* Fill empty spots */}
                            {events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length < itemsPerPage && 
                                Array.from({ length: itemsPerPage - events.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.66rem)] hidden md:block" />
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
