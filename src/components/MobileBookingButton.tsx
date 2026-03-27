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
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-6 lg:hidden bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
      <Link
        href="/book"
        className="flex w-full items-center justify-center border border-[#EFD077] bg-black py-4 text-[13px] font-medium uppercase tracking-[0.4em] text-[#EFD077] transition-all active:scale-95"
      >
        BOOK A TABLE
      </Link>
    </div>
  );
}
