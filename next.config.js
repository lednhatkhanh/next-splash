const dotenv = require("dotenv");
const withPWA = require("next-pwa");

dotenv.config();

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
  },
  serverRuntimeConfig: {
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
  },
});
