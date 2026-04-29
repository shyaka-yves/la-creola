import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: "la-creola",
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            ok: true,
            signature,
            timestamp,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder: "la-creola",
        });
    } catch (err: any) {
        console.error("Cloudinary sign error:", err);
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
}
