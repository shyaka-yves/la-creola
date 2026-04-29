import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

function fileType(res: any): "image" | "video" | "pdf" {
  if (res.resource_type === "video") return "video";
  const format = res.format?.toLowerCase() || "";
  if (format === "pdf") return "pdf";
  return "image";
}

export async function GET() {
  try {
    // Fetch images and videos from Cloudinary
    // Note: PDF files are usually classified as 'image' or 'raw' depending on how they were uploaded
    const [imageRes, videoRes] = await Promise.all([
      cloudinary.api.resources({ max_results: 500, type: 'upload', resource_type: 'image' }),
      cloudinary.api.resources({ max_results: 500, type: 'upload', resource_type: 'video' })
    ]);

    const allResources = [...imageRes.resources, ...videoRes.resources];
    
    // Sort by creation date descending
    allResources.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const files = allResources.map((res: any) => ({
      name: res.public_id,
      url: res.secure_url,
      type: fileType(res),
      size: res.bytes || 0,
    }));

    return NextResponse.json({ ok: true, files });
  } catch (err: any) {
    console.error("Cloudinary list error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message || "Failed to load media from Cloudinary" 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using a buffer
    const uploadRes = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "la-creola", // Optional: put in a folder
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const result = uploadRes as any;

    return NextResponse.json({
      ok: true,
      file: { 
        name: result.public_id, 
        url: result.secure_url,
        type: result.resource_type === "video" ? "video" : (result.format === "pdf" ? "pdf" : "image")
      },
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message || "Upload to Cloudinary failed" 
    }, { status: 500 });
  }
}
