import { useRouter } from 'next/router';
import { fetchSearchPhotos, PER_PAGE } from '~/fetchers';
import { useInfiniteQuery } from 'react-query';

export const useSearchPhotos = (initialSearchResult) => {
  const router = useRouter();

  const { data, canFetchMore, fetchMore, isFetchingMore, isFetching } = useInfiniteQuery({
    queryKey: ['searchPhotos', { query: router.query.query }],
    queryFn: fetchSearchPhotos,
    config: {
      getFetchMore: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage.total_pages;

        if (currentPage >= totalPages) {
          return undefined;
        }

        return {
          page: currentPage + 1,
          perPage: PER_PAGE,
        };
      },
      initialData: [initialSearchResult],
    },
  });

  return {
    data,
    canFetchMore,
    fetchMore,
    isFetchingMore,
    isFetching,
  };
};
