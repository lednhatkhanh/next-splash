import React from 'react';

import { fetchPhotos } from '~/fetchers';
import { getDeviceInfo, getAbsoluteUrl, getToken } from '~/utils';
import { DeviceInfoProvider } from '~/containers';
import { AuthProvider } from '~/containers';
import { PhotosPageHead, PhotosPageContent } from '~/modules/photos';

const HomePage = ({ photos, deviceInfo, origin, loggedIn }) => {
  const appInfoProviderValue = React.useMemo(() => ({ deviceInfo, origin }), [deviceInfo, origin]);
  const authProviderValue = React.useMemo(() => ({ loggedIn }), [loggedIn]);
  const latestPhoto = photos[photos.length - 1];

  return (
    <>
      <DeviceInfoProvider value={appInfoProviderValue}>
        <AuthProvider value={authProviderValue}>
          <PhotosPageHead photo={latestPhoto} />
          <PhotosPageContent photos={photos} />
        </AuthProvider>
      </DeviceInfoProvider>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const token = getToken(req);
  const photos = await fetchPhotos(
    'photos',
    { page: 1 },
    {
      req,
    },
  );
  const deviceInfo = getDeviceInfo(req);
  const { origin } = getAbsoluteUrl(req);

  return {
    props: {
      photos: photos.errors ? [] : photos,
      deviceInfo,
      origin,
      loggedIn: !!token,
    },
  };
};

export default HomePage;
