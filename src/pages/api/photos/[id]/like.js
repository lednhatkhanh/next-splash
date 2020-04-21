import { fetchUnsplash } from '~/utils';

const likePhotoAPI = async (req, res) => {
  if (['POST', 'DELETE'].indexOf(req.method) === -1) {
    res.status(404).json({ error: 'Not found' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const result = await fetchUnsplash(`photos/${req.query.id}/like`, {
    method: req.method,
    req,
  });

  res.send(result);
};

export default likePhotoAPI;
