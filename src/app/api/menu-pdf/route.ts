import { NextResponse } from "next/server";
import { fetchMenuBytes, getCloudinarySignedUrl } from "@/lib/menuMediaServer";

export const runtime = "nodejs";

const ALLOWED_HOSTS = [
  "res.cloudinary.com",
  "cloudinary.com",
  "supabase.co",
];

function isAllowedUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url")?.trim();
  if (!url) {
    return NextResponse.json({ ok: false, error: "Missing url" }, { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ ok: false, error: "URL not allowed" }, { status: 400 });
  }

  try {
    const result = await fetchMenuBytes(url);
    if (!result) {
      const signed = getCloudinarySignedUrl(url);
      if (signed) {
        return NextResponse.redirect(signed);
      }
      return NextResponse.json(
        { ok: false, error: "Failed to fetch menu PDF" },
        { status: 502 }
      );
    }

    const contentType = result.contentType.includes("pdf")
      ? "application/pdf"
      : result.contentType;

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    const signed = getCloudinarySignedUrl(url);
    if (signed) {
      return NextResponse.redirect(signed);
    }
    return NextResponse.json({ ok: false, error: "Failed to load menu PDF" }, { status: 500 });
  }
}
