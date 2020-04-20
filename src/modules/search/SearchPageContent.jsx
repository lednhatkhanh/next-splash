import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import { useInfiniteQuery, queryCache, useMutation } from "react-query";

import { Layout, PhotosList } from "~/components";
import {
  fetchSearchPhotos,
  toggleLikePhotoMutation,
  PER_PAGE,
} from "~/fetchers";
import { SearchPageSearchBox } from "./SearchPageSearchBox";
import { AuthContext } from "~/containers";

export const SearchPageContent = ({ searchResult: initialSearchResult }) => {
  const classes = useStyles();
  const router = useRouter();
  const { loggedIn } = React.useContext(AuthContext);
  const [query, setQuery] = React.useState(router.query.query);
  const {
    data,
    canFetchMore,
    fetchMore,
    isFetchingMore,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["searchPhotos", { query: router.query.query }],
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
  const [toggleLikePhoto] = useMutation(toggleLikePhotoMutation, {
    onMutate: ({ id: mutatingPhotoId, type }) => {
      const oldQueryData = queryCache.getQueryData([
        "searchPhotos",
        { query: router.query.query },
      ]);

      queryCache.setQueryData(
        ["searchPhotos", { query: router.query.query }],
        oldQueryData.map((page) => ({
          ...page,
          results: page.results.map((currentPhoto) =>
            currentPhoto.id === mutatingPhotoId
              ? {
                  ...currentPhoto,
                  likes:
                    type === "unlike"
                      ? currentPhoto.likes - 1
                      : currentPhoto.likes + 1,
                  liked_by_user: type === "unlike" ? false : true,
                }
              : currentPhoto
          ),
        }))
      );

      return () =>
        queryCache.setQueryData(
          ["searchPhotos", { query: router.query.query }],
          oldQueryData
        );
    },
    onError: (_err, _data, rollback) => rollback(),
    onSettled: () => {
      queryCache.refetchQueries([
        "searchPhotos",
        { query: router.query.query },
      ]);
    },
  });

  const photos = React.useMemo(
    () => data.map(({ results }) => results).flat(1),
    [data]
  );

  const handleFetchMore = () => {
    if (canFetchMore) {
      fetchMore();
    }
  };

  const handleSearchInputChange = React.useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    router.push("/search/[query]", `/search/${query}`, { shallow: false });
  };

  const handleToggleLike = async (photo) => {
    if (!loggedIn) {
      return;
    }

    await toggleLikePhoto({
      id: photo.id,
      type: photo.liked_by_user ? "unlike" : "like",
    });
  };

  return (
    <Layout className={classes.layout}>
      <Typography className={classes.title} component="h1" variant="h3">
        {router.query.query}
      </Typography>

      <SearchPageSearchBox
        value={query}
        onChange={handleSearchInputChange}
        onSubmit={handleSearch}
      />

      <PhotosList
        photos={photos}
        isFetchingMore={isFetchingMore}
        onFetchMore={handleFetchMore}
        isFetching={isFetching && !isFetchingMore}
        onToggleLike={handleToggleLike}
      />
    </Layout>
  );
};

const useStyles = makeStyles((theme) => ({
  layout: {
    padding: theme.spacing(3),
  },
  title: { marginBottom: 20 },
}));
