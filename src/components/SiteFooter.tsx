import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black/95">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="heading-font text-base tracking-[0.18em] text-white sm:text-lg">
              La creola
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="border-b border-[#D4AF37] text-zinc-200 hover:text-[#D4AF37]"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37]"
              >
                Facebook
              </a>
              <a
                href="https://wa.me/250793084995"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4AF37]"
              >
                WhatsApp
              </a>
            </div>
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

          <div>
            <p className="text-sm font-semibold text-[#D4AF37]">Subscribe</p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="h-11 flex-1 rounded border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                className="gold-gradient inline-flex h-11 items-center justify-center rounded px-5 text-sm font-semibold text-black"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-zinc-400">
              Get updates &amp; offers from La Creola Restaurant.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-500">
          © 2023 La Creola Restaurant.
        </div>
      </div>
    </footer>
  );
}

