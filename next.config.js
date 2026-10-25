/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_PAGES === "true" ? "/pi44a" : "";

module.exports = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
