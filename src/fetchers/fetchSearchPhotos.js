import { fetchAPI } from "~/utils";

export const fetchSearchPhotos = (_key, { query }, { page, perPage }, req) => {
  const promise = fetchAPI(
    `search/photos?query=${query}&page=${page}&per_page=${perPage}`,
    {
      req,
    }
  );

  return promise;
};
