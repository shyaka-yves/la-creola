import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function GET() {
  await ensureUploadDir();
  const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
  return NextResponse.json({
    ok: true,
    files: files.map((name) => {
      const lower = name.toLowerCase();
      if (lower.match(/\.(mp4|webm|mov)$/)) return { name, url: `/uploads/${name}`, type: "video" };
      if (lower.match(/\.(pdf)$/)) return { name, url: `/uploads/${name}`, type: "pdf" };
      return { name, url: `/uploads/${name}`, type: "image" };
    }),
  });
}

export async function POST(req: Request) {
  await ensureUploadDir();
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const ext =
    file.name.includes(".") ? `.${file.name.split(".").pop()}`.toLowerCase() : "";
  const safeExt = ext.match(/^\.(png|jpg|jpeg|webp|gif|mp4|webm|mov|pdf)$/) ? ext : "";
  const base = crypto.randomBytes(10).toString("hex");
  const filename = `${Date.now()}-${base}${safeExt}`;
  const dest = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, buffer);

  return NextResponse.json({
    ok: true,
    file: { name: filename, url: `/uploads/${filename}` },
  });
}

