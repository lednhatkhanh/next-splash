import { fetchUnsplash } from "~/utils";

const getPhotoDetailsAPI = async (req, res) => {
  const photo = await fetchUnsplash(`photos/${req.query.id}`);

  res.send(photo);
};

export default getPhotoDetailsAPI;
