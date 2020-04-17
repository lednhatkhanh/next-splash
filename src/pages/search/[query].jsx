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
import { useInfiniteQuery } from "react-query";

import { Layout, PhotosList } from "~/components";
import { fetchSearchPhotos } from "~/fetchers";
import { getDeviceInfo } from "~/utils";
import { DeviceInfoProvider } from "~/containers";

const InputProps = {
  startAdornment: (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ),
};

const PER_PAGE = 15;

const SearchPage = ({ searchResult: initialSearchResult, deviceInfo }) => {
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

  return (
    <>
      <Head>
        <title>Search - Next Splash</title>
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
          />
        </Layout>
      </DeviceInfoProvider>
    </>
  );
};

SearchPage.propTypes = {
  searchResult: PropTypes.object.isRequired,
  deviceInfo: PropTypes.object.isRequired,
};

export const getServerSideProps = async ({ query, req }) => {
  const deviceInfo = getDeviceInfo(req);
  const searchResult = await fetchSearchPhotos(
    "searchPhotos",
    { query: query.query },
    {
      page: 1,
      perPage: PER_PAGE,
    },
    req
  );

  return {
    props: {
      searchResult,
      deviceInfo,
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
