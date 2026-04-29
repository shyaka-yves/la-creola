import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "fbgptlgpsleipafdmrwm.supabase.co",
      },
    ],
  },
};

export default nextConfig;
