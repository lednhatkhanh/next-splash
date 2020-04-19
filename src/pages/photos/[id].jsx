import React from "react";
import PropTypes from "prop-types";
import { getDeviceInfo, redirect, getAbsoluteUrl, getToken } from "~/utils";
import { fetchPhotoDetails } from "~/fetchers";
import { DeviceInfoProvider } from "~/containers";
import { PhotoDetailsPageHead } from "~/modules/photoDetails";
import { PhotoDetailsPageContent } from "~/modules/photoDetails/PhotoDetailsPageContent";
import { AuthProvider } from "~/containers/AuthProvider";

const PhotoDetailPage = ({ photoDetails, deviceInfo, origin, loggedIn }) => {
  const authProviderValue = React.useMemo(() => ({ loggedIn }), [loggedIn]);

  return (
    <>
      <PhotoDetailsPageHead origin={origin} photoDetails={photoDetails} />

      <DeviceInfoProvider value={deviceInfo}>
        <AuthProvider value={authProviderValue}>
          <PhotoDetailsPageContent photoDetails={photoDetails} />
        </AuthProvider>
      </DeviceInfoProvider>
    </>
  );
};

PhotoDetailPage.propTypes = {
  deviceInfo: PropTypes.object.isRequired,
  photoDetails: PropTypes.object.isRequired,
  origin: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export const getServerSideProps = async ({ req, query, res }) => {
  const photoId = query.id;
  const deviceInfo = getDeviceInfo(req);
  const photoDetails = await fetchPhotoDetails("photoDetails", photoId, {
    req,
  });
  const { origin } = getAbsoluteUrl(req);
  const token = getToken(req);

  if (photoDetails.errors) {
    redirect("/404", res);
  }

  return {
    props: {
      deviceInfo,
      photoDetails,
      origin,
      loggedIn: !!token,
    },
  };
};

export default PhotoDetailPage;
