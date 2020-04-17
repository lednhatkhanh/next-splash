import fetch from "isomorphic-unfetch";

import { getAbsoluteUrl } from "./getAbsoluteUrl";

export const fetchAPI = (path, options = {}) => {
  const { req, ...otherOptions } = options;
  const { origin: absoluteUrl } = getAbsoluteUrl(req);

  return fetch(`${absoluteUrl}/api/${path}`, otherOptions).then((res) =>
    res.json()
  );
};
