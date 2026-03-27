"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBookingButton() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden">
      <Link
        href="/book"
        className="flex w-full items-center justify-center rounded-xl bg-[#FDE68A] py-4 text-xs font-bold uppercase tracking-[0.3em] text-black shadow-2xl transition-all active:scale-95 sm:text-sm"
      >
        <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-black"></span>
        Book a Table Now
      </Link>
    </div>
  );
}
