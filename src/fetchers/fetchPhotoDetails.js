import { fetchAPI } from "~/utils";

export const fetchPhotoDetails = (_key, id, req) => {
  const promise = fetchAPI(`photos/${id}`, {
    req,
  });

  return promise;
};
