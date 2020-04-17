import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  UNSPLASH_ACCESS_KEY,
  UNSPLASH_SECRET_KEY,
} = getConfig().serverRuntimeConfig;

export const fetchUnsplash = (path, options = {}) => {
  if (!UNSPLASH_ACCESS_KEY || !UNSPLASH_SECRET_KEY) {
    throw new Error("Missing unsplash access and secret keys");
  }

  return fetch(`https://api.unsplash.com/${path}`, {
    ...options,
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  }).then((res) => res.json());
};
