import queryString from "query-string";
import { fetchUnsplash } from "~/utils";

const searchPhotosAPI = async (req, res) => {
  const photos = await fetchUnsplash(
    `search/photos?${queryString.stringify(req.query)}`,
    {
      req,
    }
  );

  res.send(photos);
};

export default searchPhotosAPI;
