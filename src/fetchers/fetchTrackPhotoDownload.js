import { fetchAPI } from '~/utils';

export const fetchTrackPhotoDownload = async (_key, id) => {
  const promise = fetchAPI(`photos/${id}/download`);

  return promise;
};
