import { fetchAPI } from "~/utils";

export function fetchPhotoStatistics(_key, id) {
  const promise = fetchAPI(`photos/${id}/statistics`);

  return promise;
}
