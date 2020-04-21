import { fetchAPI } from '~/utils';
import { PER_PAGE } from './config';

export const fetchPhotos = (
  _key,
  { page },
  { req = undefined } = {
    req: undefined,
  },
) => {
  const promise = fetchAPI(`photos?page=${page}&per_page=${PER_PAGE}`, {
    req,
  });

  return promise;
};
