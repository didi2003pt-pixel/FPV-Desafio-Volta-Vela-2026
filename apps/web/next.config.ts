import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@desafio/auth", "@desafio/config", "@desafio/database", "@desafio/game", "@desafio/ui"],
  poweredByHeader: false,
};

export default nextConfig;
