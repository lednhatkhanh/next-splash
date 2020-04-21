import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useExtractPhotoMetadata } from '~/hooks';
import { DeviceInfoContext } from '~/containers';

export const PhotoDetailsPageHead = ({ photoDetails }) => {
  const { origin } = React.useContext(DeviceInfoContext);
  const { description } = useExtractPhotoMetadata(photoDetails);

  return (
    <Head>
      <title>{`${description} - Next Splash`}</title>
      <meta name="description" content={description} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Next Splash" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={photoDetails.urls.regular} />
      <meta name="twitter:image:alt" content={description} />

      {/* OpenGraph tags */}
      <meta property="og:title" content="Next Splash" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${origin}/photos/${photoDetails.id}`} />
      <meta property="og:type" content="website" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content={`${photoDetails.width}`} />
      <meta property="og:image:height" content={`${photoDetails.height}`} />
      <meta property="og:image" content={photoDetails.urls.regular} />
      <meta property="og:image:alt" content={description} />
    </Head>
  );
};

PhotoDetailsPageHead.propTypes = {
  photoDetails: PropTypes.object.isRequired,
};
