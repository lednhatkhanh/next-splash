import React from "react";

import { fetchPhotos } from "~/fetchers";
import { getDeviceInfo, getAbsoluteUrl, getToken } from "~/utils";
import { DeviceInfoProvider } from "~/containers";
import { AuthProvider } from "~/containers";
import { PhotosPageHead, PhotosPageContent } from "~/modules/photos";

const HomePage = ({ photos, deviceInfo, origin, loggedIn }) => {
  const authProviderValue = React.useMemo(() => ({ loggedIn }), [loggedIn]);
  const latestPhoto = photos[photos.length - 1];

  return (
    <>
      <PhotosPageHead origin={origin} photo={latestPhoto} />

      <DeviceInfoProvider value={deviceInfo}>
        <AuthProvider value={authProviderValue}>
          <PhotosPageContent photos={photos} />
        </AuthProvider>
      </DeviceInfoProvider>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const token = getToken(req);
  const photos = await fetchPhotos(
    "photos",
    { page: 1 },
    {
      req,
    }
  );
  const deviceInfo = getDeviceInfo(req);
  const { origin } = getAbsoluteUrl(req);

  return {
    props: {
      photos,
      deviceInfo,
      origin,
      loggedIn: !!token,
    },
  };
};

export default HomePage;
