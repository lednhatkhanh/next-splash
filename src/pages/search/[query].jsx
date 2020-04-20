import React from "react";
import PropTypes from "prop-types";

import { fetchSearchPhotos, PER_PAGE } from "~/fetchers";
import { getDeviceInfo, getToken, getAbsoluteUrl } from "~/utils";
import { DeviceInfoProvider, AuthProvider } from "~/containers";
import { SearchPageHead, SearchPageContent } from "~/modules/search";

const SearchPage = ({ loggedIn, searchResult, deviceInfo, origin }) => {
  const authProviderValue = React.useMemo(() => ({ loggedIn }), [loggedIn]);
  const latestInitialPhoto =
    searchResult.results[searchResult.results.length - 1];

  return (
    <>
      <SearchPageHead photo={latestInitialPhoto} origin={origin} />

      <DeviceInfoProvider value={deviceInfo}>
        <AuthProvider value={authProviderValue}>
          <SearchPageContent searchResult={searchResult} />
        </AuthProvider>
      </DeviceInfoProvider>
    </>
  );
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

SearchPage.propTypes = {
  searchResult: PropTypes.object.isRequired,
  deviceInfo: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  origin: PropTypes.string.isRequired,
};

export default SearchPage;
