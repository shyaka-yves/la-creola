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
    
    // Dynamic items to show based on window width
    // On mobile we show ~1.2 items (peek), on tablet ~2.2, on desktop 3
    const [itemsToShow, setItemsToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) {
                setItemsToShow(1.1);
            } else if (window.innerWidth < 768) {
                setItemsToShow(1.5);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2.2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = events.length - (itemsToShow > 1 ? Math.floor(itemsToShow) : 1);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev >= events.length - 1 ? 0 : prev + 1));
    }, [events.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? events.length - 1 : prev - 1));
    }, [events.length]);

    useEffect(() => {
        if (!isAutoPlaying || events.length <= 1) return;
        const interval = setInterval(next, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, next, events.length]);

    if (events.length === 0) return null;

    return (
        <div 
            className="relative w-full py-4 overflow-x-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="mx-auto max-w-[1400px]">
                <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ 
                        transform: `translateX(calc(-${currentIndex * (100 / itemsToShow)}% + ${itemsToShow < 3 ? (itemsToShow === 1.1 ? '4.5%' : (itemsToShow === 1.5 ? '25%' : '8%')) : '0%'}))`,
                        paddingLeft: itemsToShow < 3 ? (itemsToShow === 1.1 ? '5%' : (itemsToShow === 1.5 ? '0%' : '10%')) : '0'
                    }}
                >
                    {events.map((event, index) => (
                        <div 
                            key={index} 
                            className="shrink-0 px-3 transition-opacity duration-500"
                            style={{ 
                                width: `${100 / itemsToShow}%`,
                                opacity: itemsToShow < 3 && Math.abs(index - currentIndex) > 1 ? 0.3 : 1
                            }}
                        >
                            <article className="card-glass flex h-full w-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/60">
                                <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/20">
                                    <Image
                                        src={event.imageSrc}
                                        alt={event.title}
                                        fill
                                        className="object-contain transition-transform duration-700 hover:scale-105"
                                        unoptimized={event.imageSrc.startsWith("http")}
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                </div>
                                <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                                        {event.date}
                                    </p>
                                    <h2 className="mt-2 text-sm font-semibold text-white leading-tight">{event.title}</h2>
                                    <p className="mt-2 text-xs text-zinc-400 font-light line-clamp-2">{event.description}</p>
                                    <Link
                                        href={event.href}
                                        className="gold-gradient mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-black shadow-lg shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all w-full whitespace-nowrap overflow-hidden"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Hidden on small mobile if peek is enough */}
            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:border-gold hover:text-gold transition-all sm:left-4"
                aria-label="Previous"
            >
                ‹
            </button>
            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:border-gold hover:text-gold transition-all sm:right-4"
                aria-label="Next"
            >
                ›
            </button>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center gap-1.5">
                {events.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                            index === currentIndex ? "w-8 bg-gold" : "w-1.5 bg-zinc-800"
                        }`}
                        aria-label={`Go to ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

const gapSize: Record<number, number> = {
    1: 0,
    2: 12, // (gap-6 is 24px, so 12px adjustment per item?)
    3: 16  // (gap-6 / 3 * 2? Actually it's simpler)
};
