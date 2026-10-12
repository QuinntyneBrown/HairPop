import type { NextConfig } from 'next';

const config: NextConfig = {
  // The integration-test server builds into its own folder so it can run beside `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  serverExternalPackages: ['@node-rs/argon2', '@prisma/client'],
  poweredByHeader: false,
};

export default config;
