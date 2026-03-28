/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '*': ['docs/**'],
  },
  env: {
    GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || '',
  },
};

export default nextConfig;
