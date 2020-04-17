const dotenv = require("dotenv");
const withPWA = require("next-pwa");

const defaultRuntimeCaching = require("next-pwa/cache");

dotenv.config();

const defaultConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
  },
};

const PWAConfig = {
  pwa: {
    dest: "public",
    // disable: process.env.NODE_ENV !== "production",
    runtimeCaching: [
      {
        urlPattern: /^https?.*\/api\/.*/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "app-api-response",
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      {
        urlPattern: /^https:\/\/images.unsplash.com.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "unsplash-image-assets",
          cacheableResponse: {
            statuses: [0, 200],
          },
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
      ...defaultRuntimeCaching,
    ],
  },
};

const appConfig =
  process.env.NODE_ENV === "production"
    ? withPWA({
        ...defaultConfig,
        ...PWAConfig,
      })
    : defaultConfig;

module.exports = appConfig;
