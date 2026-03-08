"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/events", label: "EVENTS" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [logoError, setLogoError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center">
          {logoError ? (
            <span className="text-lg font-semibold tracking-wide text-[#D4AF37] sm:text-xl">
              La Creola
            </span>
          ) : (
            <Image
              src="/logo.png"
              alt="La Creola"
              width={140}
              height={44}
              className="h-9 w-auto object-contain sm:h-11"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] uppercase tracking-widest text-zinc-400 lg:flex xl:gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-[#EFD077]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/book"
            className="hidden border border-[#EFD077] bg-transparent px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-[#EFD077] transition-all hover:bg-[#EFD077] hover:text-black lg:inline-flex"
          >
            BOOK A TABLE
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded border border-zinc-600 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-[52px] z-40 overflow-y-auto bg-black transition-all duration-300 lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        style={{ height: mobileOpen ? "calc(100vh - 52px)" : 0 }}
      >
        <nav className="flex flex-col px-4 py-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-zinc-800 py-4 text-sm uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]"
            >
              {item.label}
            </Link>
          ))}
          <a href="/book" onClick={() => setMobileOpen(false)} className="mt-4 flex items-center justify-center border border-[#D4AF37] bg-transparent py-3 text-sm uppercase tracking-widest text-white">
            BOOK A TABLE
          </a>
        </nav>
      </div>
    </header>
  );
}

