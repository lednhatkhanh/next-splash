import { useMutation, queryCache } from 'react-query';
import { toggleLikePhotoMutation } from '~/fetchers';

export const useToggleLikePhotoMutation = (photoDetails) => {
  const [toggleLikePhoto] = useMutation(toggleLikePhotoMutation, {
    onMutate: ({ id: mutatingPhotoId, type }) => {
      const oldPhotoDetails = queryCache.getQueryData('photoDetails') ?? photoDetails;

      queryCache.setQueryData('photoDetails', {
        ...oldPhotoDetails,
        liked_by_user: type === 'unlike' ? false : true,
        likes: type === 'unlike' ? oldPhotoDetails.likes - 1 : oldPhotoDetails.likes + 1,
      });

      return () => queryCache.setQueryData('photoDetails', oldPhotoDetails);
    },
    onError: (_err, _data, rollback) => rollback(),
    onSettled: () => {
      queryCache.refetchQueries('photoDetails');
    },
  });

  return toggleLikePhoto;
};
