import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "dragonwilds.runescape.wiki" }],
  },
};

export default nextConfig;
