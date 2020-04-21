import { useQuery } from 'react-query';
import { fetchPhotoDetails } from '~/fetchers';

export const useFetchPhotoDetails = (initialPhotoDetails) => {
  const { data } = useQuery(['photoDetails', initialPhotoDetails.id], fetchPhotoDetails, {
    initialData: initialPhotoDetails,
  });

  return { data };
};
