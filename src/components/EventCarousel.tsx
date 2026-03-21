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

    // To handle infinite loop smoothly, we clone the list
    // For 3 visible items, we need a bit of buffer
    const displayItems = events.length > 3 ? [...events, ...events, ...events] : events;
    const offset = events.length > 3 ? events.length : 0;
    
    // Adjust start index if looping
    useEffect(() => {
        if (events.length > 3) {
            setCurrentIndex(events.length);
        }
    }, [events.length]);

    const next = useCallback(() => {
        if (events.length <= 3) {
            setCurrentIndex((prev) => (prev + 1) % events.length);
            return;
        }
        setCurrentIndex((prev) => prev + 1);
    }, [events.length]);

    const prev = useCallback(() => {
        if (events.length <= 3) {
            setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
            return;
        }
        setCurrentIndex((prev) => prev - 1);
    }, [events.length]);

    // Handle loop reset
    useEffect(() => {
        if (events.length > 3) {
            if (currentIndex >= events.length * 2) {
                // Instantly jump back without transition
                const timer = setTimeout(() => {
                    if (containerRef.current) containerRef.current.style.transition = "none";
                    setCurrentIndex(currentIndex - events.length);
                    setTimeout(() => {
                        if (containerRef.current) containerRef.current.style.transition = "transform 700ms ease-in-out";
                    }, 50);
                }, 700);
                return () => clearTimeout(timer);
            }
            if (currentIndex < events.length) {
                const timer = setTimeout(() => {
                    if (containerRef.current) containerRef.current.style.transition = "none";
                    setCurrentIndex(currentIndex + events.length);
                    setTimeout(() => {
                        if (containerRef.current) containerRef.current.style.transition = "transform 700ms ease-in-out";
                    }, 50);
                }, 700);
                return () => clearTimeout(timer);
            }
        }
    }, [currentIndex, events.length]);

    useEffect(() => {
        if (!isAutoPlaying || events.length <= 1) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next, events.length]);

    if (events.length === 0) return null;

    const translateAmount = events.length > 3 ? currentIndex : currentIndex;

    return (
        <div 
            className="relative w-full"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="overflow-hidden">
                <div 
                    ref={containerRef}
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ 
                        transform: `translateX(-${(translateAmount * (100 / (events.length > 3 ? 3 : events.length)))}%)`,
                        width: `${(displayItems.length * (100 / (events.length > 3 ? 3 : events.length)))}%`
                    }}
                >
                    {displayItems.map((event, index) => (
                        <div 
                            key={index} 
                            style={{ width: `${(100 / displayItems.length)}%` }}
                            className="px-3"
                        >
                            <article className="card-glass flex h-full flex-col overflow-hidden rounded-2xl border-white/5 transition hover:-translate-y-1">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={event.imageSrc}
                                        alt={event.title}
                                        fill
                                        className="object-contain transition-transform duration-700 hover:scale-105 bg-black/40"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </div>
                                <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                                        {event.date}
                                    </p>
                                    <h3 className="mt-3 text-lg font-medium tracking-tight text-white line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-zinc-400 font-light line-clamp-2">
                                        {event.description}
                                    </p>
                                    <Link
                                        href={event.href}
                                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all w-full"
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
            {events.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all md:-left-12"
                        aria-label="Previous event"
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all md:-right-12"
                        aria-label="Next event"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {events.length > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                    {events.map((_, index) => {
                        const actualIndex = events.length > 3 ? (currentIndex % events.length) : currentIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (events.length > 3) {
                                        setCurrentIndex(index + events.length);
                                    } else {
                                        setCurrentIndex(index);
                                    }
                                }}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    actualIndex === index ? "w-8 bg-[#EFD077]" : "w-2 bg-zinc-800"
                                }`}
                                aria-label={`Go to event ${index + 1}`}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
