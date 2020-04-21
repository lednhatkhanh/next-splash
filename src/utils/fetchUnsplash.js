import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

const { UNSPLASH_ACCESS_KEY, UNSPLASH_SECRET_KEY } = getConfig().serverRuntimeConfig;

export const fetchUnsplash = (path, options = {}) => {
  if (!UNSPLASH_ACCESS_KEY || !UNSPLASH_SECRET_KEY) {
    throw new Error('Missing unsplash access and secret keys');
  }

  const { req, ...otherOptions } = options;
  const authHeader = req?.headers.authorization;

  return fetch(`https://api.unsplash.com/${path}`, {
    ...otherOptions,
    headers: {
      Authorization: authHeader ?? `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      'Content-Type': 'application/json',
      'Accept-Version': 'v1',
      ...(otherOptions.headers ?? {}),
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
    if (rateLimitRemaining === '0') {
      return {
        errors: ['Rate limit exceed'],
      };
    }

    return res.json();
  });
};
