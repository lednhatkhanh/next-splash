import queryString from 'query-string';

import { fetchUnsplash } from '~/utils';

const getPhotosAPI = async (req, res) => {
  const photos = await fetchUnsplash(`photos?${queryString.stringify(req.query)}`, {
    req,
  });

  res.send(photos);
};

export default getPhotosAPI;
