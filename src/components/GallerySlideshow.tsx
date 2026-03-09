"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FadeIn } from "./FadeIn";

type ImageItem = {
    id: string;
    src: string;
    label: string;
};

export function GallerySlideshow({ images }: { images: ImageItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") setIsFullScreen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [next, prev]);

    if (images.length === 0) return null;

    const currentImage = images[currentIndex];

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4">
            {/* Main Slideshow View */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        key={currentImage.id}
                        src={currentImage.src}
                        alt={currentImage.label}
                        fill
                        className="object-contain p-2 transition-opacity duration-500"
                        priority
                        unoptimized={currentImage.src.startsWith("http")}
                    />
                </div>

                {/* Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                        onClick={prev}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
                        aria-label="Previous image"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
                        aria-label="Next image"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Info Label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div className="rounded-xl bg-black/50 px-4 py-2 backdrop-blur-md border border-white/5">
                        <p className="text-sm font-medium text-white">{currentImage.label}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mt-1">
                            Image {currentIndex + 1} of {images.length}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsFullScreen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-md border border-white/5 transition-colors hover:bg-white/10"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-8 flex justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={img.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${currentIndex === idx ? "border-[#D4AF37] scale-105 shadow-lg shadow-yellow-500/10" : "border-transparent opacity-50 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={img.src}
                            alt={img.label}
                            fill
                            className="object-cover"
                            unoptimized={img.src.startsWith("http")}
                        />
                    </button>
                ))}
            </div>

            {/* Full Screen Portal Mockup (Optional logic expansion) */}
            {isFullScreen && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-black p-4">
                    <button
                        onClick={() => setIsFullScreen(false)}
                        className="absolute right-6 top-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                    <div className="relative flex-1">
                        <Image
                            src={currentImage.src}
                            alt={currentImage.label}
                            fill
                            className="object-contain"
                            unoptimized={currentImage.src.startsWith("http")}
                        />
                    </div>
                    <div className="py-6 text-center">
                        <p className="text-lg font-medium text-white">{currentImage.label}</p>
                        <div className="mt-4 flex justify-center gap-8">
                            <button onClick={prev} className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold">Prev</button>
                            <span className="text-zinc-500">{currentIndex + 1} / {images.length}</span>
                            <button onClick={next} className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
