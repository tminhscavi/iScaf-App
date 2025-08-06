/** @type {import('next').NextConfig} */
import PWA from 'next-pwa';

const withPWA = PWA({
  dest: 'public',
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  swSrc: 'src/worker.js',

  // Reload on update
  reloadOnOnline: true,

  // Build exclusions
  buildExcludes: [/middleware-manifest\.json$/],

  // Mode
  mode: 'production', // 'production' or 'development'

  // Precache manifest
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.map((entry) => {
        if (entry.url === './') {
          entry.url = './';
        }
        return entry;
      });
      return { manifest };
    },
  ],

  // Background sync
  cacheOnFrontEndNav: true,
});

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
