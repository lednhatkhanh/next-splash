import { fetchAPI } from "~/utils";

const PER_PAGE = 15;

export const fetchPhotos = (_key, { page }, req) => {
  const promise = fetchAPI(`photos?page=${page}&per_page=${PER_PAGE}`, {
    req,
  });

  return promise;
};
