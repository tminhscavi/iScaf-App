import { protectedRoutes } from '@/constants/route';
import type { NextConfig } from 'next';
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
  buildExcludes: [/middleware-manifest\.json$/, /app-build-manifest\.json$/],

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

  runtimeCaching: [
    // Static resources can be cached
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?)$/i,
      handler: 'CacheFirst',
    },

    // ALL pages/routes go through middleware (no caching)
    {
      urlPattern: ({ url, request }) => {
        const isSameOrigin = url.origin === self.location.origin;
        const isNavigationRequest = request.mode === 'navigate';
        const isNotStaticAsset = !/\.(js|css|png|jpg|svg|woff2?)$/i.test(
          url.pathname,
        );
        const isNotNextStatic = !url.pathname.startsWith('/_next/static');

        return (
          isSameOrigin &&
          isNavigationRequest &&
          isNotStaticAsset &&
          isNotNextStatic
        );
      },
      handler: 'NetworkOnly',
    },

    // API routes
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkOnly',
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '113.161.145.65',
      },
    ],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);
