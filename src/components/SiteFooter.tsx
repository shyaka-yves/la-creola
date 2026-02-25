import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black/95">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          <div>
            <p className="heading-font text-base tracking-[0.18em] text-white sm:text-lg">
              La creola
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              A vibrant dining destination in Kigali where bold African flavors meet Asian craftsmanship in an intimate, candlelit setting.
            </p>
            <p className="mt-3 text-sm font-medium text-[#D4AF37]">
              Working hours: All days from 10 AM to 1 AM
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#D4AF37]">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-[#D4AF37]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#D4AF37]">
                  Menus
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D4AF37]">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D4AF37]">
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-500">
          © 2023 La Creola Restaurant.
        </div>
      </div>
    </footer>
  );
}
