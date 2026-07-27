import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = "/zfree-cutter-website";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
