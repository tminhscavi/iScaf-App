/** @type {import('next').NextConfig} */
import PWA from 'next-pwa';

const withPWA = PWA({
  dest: 'public',
  // register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  swSrc: 'src/worker.js',

  // Force reload SW when network comes back
  reloadOnOnline: true,

  // Exclude files from precache manifest
  buildExcludes: [
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/, 
  ],

  // Set Workbox mode
  mode: 'production', // Can be set to 'development' to disable precache

  // Transform manifest entries if needed
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

  // Pre-cache when navigating via <Link>
  cacheOnFrontEndNav: true,
});

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
