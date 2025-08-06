/** @type {import('next').NextConfig} */
import PWA from 'next-pwa';

const withPWA = PWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  swSrc: 'src/worker.js',

  // Fallbacks for offline functionality
  fallbacks: {
    document: '/offline',
    image: '',
    audio: '',
    video: '',
    font: '',
  },

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
