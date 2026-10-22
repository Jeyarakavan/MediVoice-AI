import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Never expose backend secrets to the client — only NEXT_PUBLIC_* vars are exposed
  env: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.medivoice.ai" },
    ],
  },
};

export default nextConfig;
