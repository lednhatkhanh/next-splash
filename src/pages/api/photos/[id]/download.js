import { fetchUnsplash } from "~/utils";

const trackPhotoDownloadAPI = async (req, res) => {
  const result = await fetchUnsplash(`photos/${req.query.id}/download`, {
    req,
  });
  res.send(result);
};

export default trackPhotoDownloadAPI;
