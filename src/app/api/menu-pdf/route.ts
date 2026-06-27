import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { cloudName, cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type ParsedCloudinaryPdf = {
  cloudName: string;
  publicId: string;
  resourceType: "image" | "raw";
};

type CloudinaryDelivery = {
  publicId: string;
  resourceType: "image" | "raw";
  deliveryType: "upload" | "authenticated" | "private";
  format: string;
};

function resolvePdfUrl(pdfUrl: string, origin: string): string {
  if (pdfUrl.startsWith("/")) {
    return `${origin}${pdfUrl}`;
  }
  return pdfUrl;
}

function parseCloudinaryPdfUrl(pdfUrl: string): ParsedCloudinaryPdf | null {
  try {
    const parsed = new URL(pdfUrl);
    if (!parsed.hostname.includes("cloudinary.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex < 2) return null;

    const resourceType = segments[uploadIndex - 1];
    if (resourceType !== "image" && resourceType !== "raw") return null;

    const afterUpload = segments.slice(uploadIndex + 1);
    const withoutVersion =
      afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].slice(1))
        ? afterUpload.slice(1)
        : afterUpload;

    const publicIdWithExt = withoutVersion.join("/");
    const publicId = publicIdWithExt.replace(/\.pdf$/i, "");

    return {
      cloudName: segments[0],
      publicId: decodeURIComponent(publicId),
      resourceType: resourceType as "image" | "raw",
    };
  } catch {
    return null;
  }
}

async function resolveCloudinaryDelivery(
  publicId: string,
  preferred: "image" | "raw"
): Promise<CloudinaryDelivery | null> {
  const types: Array<"image" | "raw"> =
    preferred === "raw" ? ["raw", "image"] : ["image", "raw"];

  for (const resourceType of types) {
    try {
      const resource = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });

      const deliveryType = resource.type as CloudinaryDelivery["deliveryType"];
      return {
        publicId,
        resourceType,
        deliveryType:
          deliveryType === "authenticated" || deliveryType === "private"
            ? deliveryType
            : "upload",
        format: resource.format || "pdf",
      };
    } catch {
      // Try the other resource type.
    }
  }

  return null;
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 5 && buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
}

async function downloadFromUrl(url: string): Promise<Buffer | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const buffer = Buffer.from(await res.arrayBuffer());
  return isPdfBuffer(buffer) ? buffer : null;
}

async function downloadCloudinaryPdf(
  delivery: CloudinaryDelivery
): Promise<Buffer | null> {
  const downloadUrl = cloudinary.utils.private_download_url(
    delivery.publicId,
    delivery.format || "pdf",
    {
      resource_type: delivery.resourceType,
      type: delivery.deliveryType,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    }
  );

  return downloadFromUrl(downloadUrl);
}

async function downloadCloudinaryPdfFromArchive(
  delivery: CloudinaryDelivery
): Promise<Buffer | null> {
  const archiveUrl = cloudinary.utils.download_zip_url({
    public_ids: [delivery.publicId],
    resource_type: delivery.resourceType,
    flatten_folders: true,
  });

  const archiveRes = await fetch(archiveUrl, { cache: "no-store" });
  if (!archiveRes.ok) return null;

  const zip = await JSZip.loadAsync(await archiveRes.arrayBuffer());
  const pdfEntry = Object.values(zip.files).find(
    (file) => !file.dir && file.name.toLowerCase().endsWith(".pdf")
  );

  if (!pdfEntry) return null;

  const buffer = Buffer.from(await pdfEntry.async("nodebuffer"));
  return isPdfBuffer(buffer) ? buffer : null;
}

async function downloadCloudinarySignedUrl(
  delivery: CloudinaryDelivery
): Promise<Buffer | null> {
  const signedUrl = cloudinary.url(delivery.publicId, {
    secure: true,
    resource_type: delivery.resourceType,
    type: delivery.deliveryType,
    sign_url: true,
    format: delivery.format || "pdf",
  });

  return downloadFromUrl(signedUrl);
}

async function fetchCloudinaryPdf(
  parsed: ParsedCloudinaryPdf,
  sourceUrl: string
): Promise<Buffer | null> {
  if (cloudName && parsed.cloudName !== cloudName) {
    console.error(
      "Cloudinary cloud name mismatch:",
      parsed.cloudName,
      "expected",
      cloudName
    );
  }

  const delivery = await resolveCloudinaryDelivery(
    parsed.publicId,
    parsed.resourceType
  );

  if (delivery) {
    for (const attempt of [
      () => downloadCloudinaryPdf(delivery),
      () => downloadCloudinaryPdfFromArchive(delivery),
      () => downloadCloudinarySignedUrl(delivery),
    ]) {
      const bytes = await attempt();
      if (bytes) return bytes;
    }
  }

  for (const resourceType of ["image", "raw"] as const) {
    const fallbackDelivery: CloudinaryDelivery = {
      publicId: parsed.publicId,
      resourceType,
      deliveryType: "upload",
      format: "pdf",
    };

    for (const attempt of [
      () => downloadCloudinaryPdf(fallbackDelivery),
      () => downloadCloudinaryPdfFromArchive(fallbackDelivery),
      () => downloadCloudinarySignedUrl(fallbackDelivery),
    ]) {
      const bytes = await attempt();
      if (bytes) return bytes;
    }
  }

  return downloadFromUrl(sourceUrl);
}

function pdfResponse(body: Buffer): NextResponse {
  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(body.length),
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !cloudName) {
    return NextResponse.json(
      {
        error:
          "Missing Cloudinary credentials. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Vercel.",
      },
      { status: 500 }
    );
  }

  const pdfUrl = resolvePdfUrl(rawUrl, req.nextUrl.origin);

  try {
    if (pdfUrl.includes("res.cloudinary.com")) {
      const parsed = parseCloudinaryPdfUrl(pdfUrl);
      if (!parsed) {
        return NextResponse.json(
          { error: "Could not parse Cloudinary URL" },
          { status: 400 }
        );
      }

      const pdfBytes = await fetchCloudinaryPdf(parsed, pdfUrl);
      if (!pdfBytes) {
        return NextResponse.json(
          { error: "Failed to fetch PDF from storage" },
          { status: 502 }
        );
      }

      return pdfResponse(pdfBytes);
    }

    const upstream = await fetch(pdfUrl, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream fetch failed" },
        { status: upstream.status }
      );
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    return pdfResponse(body);
  } catch (err) {
    console.error("menu-pdf proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
