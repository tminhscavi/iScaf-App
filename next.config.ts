/** @type {import('next').NextConfig} */
import PWA from 'next-pwa';

const withPWA = PWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // runtimeCaching: [
  //   {
  //     urlPattern: /^https?.*/,
  //     handler: 'NetworkFirst',
  //     options: {
  //       cacheName: 'offlineCache',
  //       expiration: {
  //         maxEntries: 200,
  //       },
  //     },
  //   },
  // ],
  // Runtime caching strategies
  runtimeCaching: [
    // Cache HTML pages with NetworkFirst strategy
    {
      urlPattern: /^https?.*/, // Match all pages
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache API routes
    {
      urlPattern: /^https?.*\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache static assets with CacheFirst
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache fonts
    {
      urlPattern: /\.(?:woff|woff2|ttf|otf)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache CSS and JS files
    {
      urlPattern: /\.(?:css|js)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Cache external CDN resources
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },

    // Offline fallback for navigation requests
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-fallback',
        networkTimeoutSeconds: 3,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              return `${request.url}?offline-fallback`;
            },
            handlerDidError: async () => {
              return caches.match('/offline.html');
            },
          },
        ],
      },
    },
  ],

  // Fallbacks for offline functionality
  fallbacks: {
    document: '/offline',
    image: '',
    audio: '',
    video: '',
    font: ''
  },

  // Custom service worker additional code
  swSrc: 'src/worker.js', // Optional: path to custom SW source

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

  // Push notifications setup
  customWorkerDir: 'worker', // Directory for custom worker files
});

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
