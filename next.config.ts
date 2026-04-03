import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner = "", repositoryName = ""] = repository.split("/");
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isUserSite = repositoryName === `${owner}.github.io`;
const basePath = isGitHubActions && repositoryName && !isUserSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
