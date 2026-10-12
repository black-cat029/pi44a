/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_PAGES === "true" ? "/pi44a" : "";
const nextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
