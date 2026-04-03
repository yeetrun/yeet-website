import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '*': ['docs/**'],
  },
  env: {
    GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || '',
  },

  async headers() {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
      return [
        {
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
          source: '/:path*',
        },
      ];
    }

    return [];
  },
});

export default nextConfig;
