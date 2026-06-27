"use client";

import Image from "next/image";
import { getMenuMediaKind } from "@/lib/menuMedia";

type MenuViewerProps = {
  url: string;
  directEmbedUrl?: string;
};

export function MenuViewer({ url, directEmbedUrl }: MenuViewerProps) {
  const kind = getMenuMediaKind(url);
  const embedUrl =
    directEmbedUrl ||
    (kind === "image" ? url : `/api/menu-pdf?url=${encodeURIComponent(url)}`);

  if (kind === "image") {
    return (
      <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-zinc-950 shadow-xl">
        <Image
          src={url}
          alt="La Creola menu"
          width={1200}
          height={1600}
          unoptimized
          className="h-auto w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-zinc-950 shadow-xl">
      <object data={embedUrl} type="application/pdf" className="h-[50vh] min-h-[500px] w-full md:h-[80vh] md:min-h-[600px]">
        <iframe
          src={embedUrl}
          title="Menu PDF"
          className="h-[50vh] min-h-[500px] w-full md:h-[80vh] md:min-h-[600px]"
        />
      </object>
    </div>
  );
}
