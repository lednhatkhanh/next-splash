import { fetchAPI } from '~/utils';

export const toggleLikePhotoMutation = ({ id, type }, { req = undefined } = { req: undefined }) => {
  const method = (() => {
    switch (type) {
      case 'unlike': {
        return 'DELETE';
      }
      case 'like': {
        return 'POST';
      }
      default: {
        throw new Error('Invalid type');
      }
    }
  })();

  const promise = fetchAPI(`photos/${id}/like`, {
    req,
    method,
  });

  return promise;
};
