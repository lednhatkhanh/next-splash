import fetch from "isomorphic-unfetch";

import { getAbsoluteUrl } from "./getAbsoluteUrl";
import { getToken } from "./token";

export const fetchAPI = (path, options = {}) => {
  const { req, ...otherOptions } = options;
  const token = getToken(req);
  const { origin: absoluteUrl } = getAbsoluteUrl(req);

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${absoluteUrl}/api/${path}`, {
    ...otherOptions,
    headers,
  }).then((res) => res.json());
};
