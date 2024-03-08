/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/spotistats",
  output: "export",
  images: {
    domains: ["i.scdn.co"],
  },
};

export default nextConfig;
