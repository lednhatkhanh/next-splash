import { fetchUnsplash } from "~/utils";

const fetchPhotoStatisticsAPI = async (req, res) => {
  const result = await fetchUnsplash(`photos/${req.query.id}/statistics`);
  res.send(result);
};

export default fetchPhotoStatisticsAPI;
