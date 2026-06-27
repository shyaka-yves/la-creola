import Image from "next/image";

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif)($|\?|#)/i.test(url);
}

/** Cloudinary blocks direct PDF delivery; serve via same-origin proxy for iframe viewing. */
function getMenuPdfViewerUrl(pdfUrl: string): string {
  return `/api/menu-pdf?url=${encodeURIComponent(pdfUrl)}`;
}

type MenuViewerProps = {
  menuUrl: string;
};

export function MenuViewer({ menuUrl }: MenuViewerProps) {
  const isImage = isImageUrl(menuUrl);
  const viewerUrl = !isImage ? getMenuPdfViewerUrl(menuUrl) : menuUrl;

  if (isImage) {
    return (
      <div className="relative mx-auto w-full overflow-hidden rounded-lg border border-zinc-600/50 bg-white shadow-xl">
        <Image
          src={menuUrl}
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
      <iframe
        src={viewerUrl}
        title="La Creola menu"
        className="h-[75vh] min-h-[480px] w-full border-0 md:h-[85vh] md:min-h-[650px]"
      />
    </div>
  );
}
