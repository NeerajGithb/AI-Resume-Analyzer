import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  // puppeteer-core must stay in Node.js — it cannot be bundled by webpack.
  // pdfjs-dist is used by the nodebackend for PDF parsing; kept here for safety.
  serverExternalPackages: ['puppeteer-core', 'pdfjs-dist'],
  async rewrites() {
    return [
      {
        // Proxy all API calls to the nodebackend EXCEPT routes handled locally.
        // The builder-v2/download route is served by this Next.js app itself.
        source: '/api/:path((?!builder-v2/download).*)',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
