import { FadeIn } from "@/components/FadeIn";
import { MenuViewer } from "@/components/MenuViewer";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Menu | La Creola",
  description: "Browse the exquisite culinary offerings and signature dishes at La Creola.",
};

export const dynamic = "force-dynamic";

function getMenuPdfViewerUrl(pdfUrl: string): string {
  return `/api/menu-pdf?url=${encodeURIComponent(pdfUrl)}`;
}

export default async function MenuPage() {
  const content = await getSiteContent();
  const menuUrl = content.menu.pdfUrl?.trim() ?? "";
  const menuOpenUrl = menuUrl ? getMenuPdfViewerUrl(menuUrl) : "";

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex pt-20 pb-12 sm:pt-24 sm:pb-16 items-center justify-center bg-black/95">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black opacity-90" />
        <FadeIn className="relative z-10 px-4 text-center">
          <h1 className="heading-font text-4xl font-bold uppercase text-[#D4AF37] sm:text-5xl md:text-6xl">
            Our Menu
          </h1>
          <p className="mt-4 text-sm text-zinc-300 sm:text-base">
            Explore our culinary offerings.
          </p>
        </FadeIn>
      </section>

      <section className="pb-16 sm:pb-24 bg-black/90">
        <div className="mx-auto max-w-4xl px-4">
          {menuUrl ? (
            <FadeIn>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-800/80 p-2 sm:p-4 md:p-6">
                <MenuViewer menuUrl={menuUrl} />
                <div className="mt-4 flex justify-center">
                  <a
                    href={menuOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-[#D4AF37] bg-transparent px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
                  >
                    Open Menu in New Tab
                  </a>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/50 p-8 text-center">
                <p className="text-zinc-400">Menu PDF will be available soon.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
