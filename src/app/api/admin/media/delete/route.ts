import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = (body?.name ?? "").trim();

  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return NextResponse.json({ ok: false, error: "Invalid filename" }, { status: 400 });
  }

  const target = path.join(UPLOAD_DIR, name);

  try {
    await fs.unlink(target);
  } catch {
    return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

