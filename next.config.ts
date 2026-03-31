import type { NextConfig } from "next";

import "./src/env";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
