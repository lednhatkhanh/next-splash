import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

import { Layout, PhotosList } from "~/components";
import { SearchPageSearchBox } from "./SearchPageSearchBox";
import { AuthContext } from "~/containers";
import { useSearchPhotos } from "./useSearchPhotos";
import { useToggleLikePhotoMutation } from "./useToggleLikePhotoMutation";

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
  } = useSearchPhotos(initialSearchResult);
  const toggleLikePhoto = useToggleLikePhotoMutation();

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
