import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  TextField,
  InputAdornment,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { useInfiniteQuery, useMutation, queryCache } from "react-query";

import { Layout, PhotosList } from "~/components";
import { fetchSearchPhotos, toggleLikePhotoMutation } from "~/fetchers";
import { getDeviceInfo, getToken, getAbsoluteUrl } from "~/utils";
import { DeviceInfoProvider } from "~/containers";

const InputProps = {
  startAdornment: (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ),
};

const PER_PAGE = 15;

const SearchPage = ({
  loggedIn,
  searchResult: initialSearchResult,
  deviceInfo,
  origin,
}) => {
  const classes = useStyles();
  const router = useRouter();
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

      // [{total_pages: 5, results: []}]
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

  const latestInitialPhoto =
    initialSearchResult.results[initialSearchResult.results.length - 1];
  const latestInitialPhotoDescription = latestInitialPhoto
    ? latestInitialPhoto.alt_description ??
      latestInitialPhoto.description ??
      `A photo of @${latestInitialPhoto.user.usernmame}`
    : undefined;
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
    <>
      <Head>
        <title>{router.query.query} - Next Splash</title>

        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Next Splash" />
        <meta
          name="twitter:description"
          content={`Photos about ${router.query.query}`}
        />
        {latestInitialPhoto && (
          <>
            {" "}
            <meta
              name="twitter:image"
              content={latestInitialPhoto.urls.regular}
            />
            <meta
              name="twitter:image:alt"
              content={latestInitialPhotoDescription}
            />
          </>
        )}

        {/* OpenGraph tags */}
        <meta property="og:title" content="Next Splash" />
        <meta
          property="og:description"
          content={`Photos about ${router.query.query}`}
        />
        <meta property="og:url" content={origin} />
        <meta property="og:type" content="website" />

        {latestInitialPhoto && (
          <>
            <meta property="og:image:type" content="image/jpeg" />
            <meta
              property="og:image:width"
              content={`${latestInitialPhoto.width}`}
            />
            <meta
              property="og:image:height"
              content={`${latestInitialPhoto.height}`}
            />
            <meta
              property="og:image"
              content={latestInitialPhoto.urls.regular}
            />
            <meta
              property="og:image:alt"
              content={latestInitialPhotoDescription}
            />
          </>
        )}
      </Head>

      <DeviceInfoProvider value={deviceInfo}>
        <Layout className={classes.layout}>
          <Typography className={classes.title} component="h1" variant="h3">
            {router.query.query}
          </Typography>

          <form
            className={classes.searchBar}
            method="POST"
            target="#"
            onSubmit={handleSearch}
          >
            <TextField
              InputProps={InputProps}
              value={query}
              variant="outlined"
              size="medium"
              type="search"
              fullWidth
              required
              onChange={handleSearchInputChange}
            />
          </form>

          <PhotosList
            photos={photos}
            isFetchingMore={isFetchingMore}
            onFetchMore={handleFetchMore}
            isFetching={isFetching && !isFetchingMore}
            onToggleLike={handleToggleLike}
          />
        </Layout>
      </DeviceInfoProvider>
    </>
  );
};

SearchPage.propTypes = {
  searchResult: PropTypes.object.isRequired,
  deviceInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  origin: PropTypes.string.isRequired,
};

export const getServerSideProps = async ({ query, req }) => {
  const deviceInfo = getDeviceInfo(req);
  const token = getToken(req);
  const searchResult = await fetchSearchPhotos(
    "searchPhotos",
    { query: query.query },
    {
      page: 1,
      perPage: PER_PAGE,
    },
    req
  );
  const { origin } = getAbsoluteUrl(req);

  return {
    props: {
      searchResult,
      deviceInfo,
      loggedIn: !!token,
      origin,
    },
  };
};

const useStyles = makeStyles((theme) => ({
  searchBar: {},
  layout: {
    padding: theme.spacing(3),
  },
  title: { marginBottom: 20 },
}));

export default SearchPage;
