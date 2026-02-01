import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "dragonwilds.runescape.wiki" }],
  },
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
