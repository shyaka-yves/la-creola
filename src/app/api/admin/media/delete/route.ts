import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { name?: string; type?: string } | null;
    const name = (body?.name ?? "").trim();
    const type = body?.type || "image";

    if (!name) {
      return NextResponse.json({ ok: false, error: "Invalid filename" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(name, {
      resource_type: type === "video" ? "video" : "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json({ ok: false, error: result.result }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Delete failed" }, { status: 500 });
  }
}
