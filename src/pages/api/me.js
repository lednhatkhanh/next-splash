import { fetchUnsplash } from "~/utils";

const searchPhotosAPI = async (req, res) => {
  const photos = await fetchUnsplash(`me`, {
    req,
  });

  res.send(photos);
};

export default searchPhotosAPI;
