import { NextResponse } from "next/server";

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
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: `Failed to fetch menu (${upstream.status})` },
        { status: upstream.status }
      );
    }

    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType.includes("pdf") ? "application/pdf" : contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to load menu PDF" }, { status: 500 });
  }
}
