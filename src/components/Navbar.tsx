"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const RESTAURANT_DROPDOWN = [
  { href: "/menu", label: "Menu" },
  { href: "/special-offers", label: "Special offers" },
  { href: "/speciality", label: "Speciality" },
  { href: "/events", label: "Events" },
];

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [logoError, setLogoError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRestaurantOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm font-medium uppercase tracking-wide text-white lg:flex xl:gap-10">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#D4AF37]"
            >
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRestaurantOpen((o) => !o)}
              className="flex items-center gap-1 transition-colors hover:text-[#D4AF37]"
              aria-expanded={restaurantOpen}
              aria-haspopup="true"
            >
              RESTAURANT
              <svg className={`h-4 w-4 transition-transform ${restaurantOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {restaurantOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-1 min-w-[180px] -translate-x-1/2 rounded border border-zinc-700 bg-black py-2 shadow-xl">
                {RESTAURANT_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-left text-sm capitalize text-white hover:bg-zinc-800 hover:text-[#D4AF37]"
                    onClick={() => setRestaurantOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_ITEMS.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[#D4AF37]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/book"
            className="hidden border border-[#D4AF37] bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#D4AF37] hover:text-black lg:inline-flex lg:px-5 lg:py-2.5 lg:text-sm"
          >
            Book a Table
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
        className={`fixed inset-x-0 top-[52px] z-40 overflow-y-auto bg-black transition-all duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ height: mobileOpen ? "calc(100vh - 52px)" : 0 }}
      >
        <nav className="flex flex-col px-4 py-6">
          <Link href="/" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">HOME</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">ABOUT US</Link>
          <div className="border-b border-zinc-800 py-2">
            <p className="py-2 text-xs uppercase tracking-wider text-zinc-500">Restaurant</p>
            {RESTAURANT_DROPDOWN.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm font-medium capitalize text-white transition-colors hover:text-[#D4AF37]">{item.label}</Link>
            ))}
          </div>
          <Link href="/gallery" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">GALLERY</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="border-b border-zinc-800 py-4 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:text-[#D4AF37]">CONTACT</Link>
          <a href="/book" onClick={() => setMobileOpen(false)} className="mt-4 flex items-center justify-center border border-[#D4AF37] bg-transparent py-3 text-sm font-medium uppercase tracking-wide text-white">
            Book a Table
          </a>
        </nav>
      </div>
    </header>
  );
}

