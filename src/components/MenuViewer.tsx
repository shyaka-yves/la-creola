"use client";

import Image from "next/image";
import type { MenuDisplay } from "@/lib/menuMediaServer";

type MenuViewerProps = {
  display: MenuDisplay;
};

export function MenuViewer({ display }: MenuViewerProps) {
  if (display.mode === "image") {
    return (
      <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-white shadow-xl">
        <Image
          src={display.src}
          alt="La Creola menu"
          width={1200}
          height={1600}
          unoptimized
          className="h-auto w-full object-contain"
        />
      </div>
    );
  }

  // Same-origin PDF stream — avoids Cloudinary browser embed restrictions.
  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-white shadow-xl">
      <iframe
        src={display.viewUrl}
        title="La Creola menu"
        className="h-[50vh] min-h-[500px] w-full md:h-[80vh] md:min-h-[600px]"
      />
    </div>
  );
}
