import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import { useExtractPhotoMetadata } from "~/hooks";

export const PhotosPageHead = ({ photo, origin }) => {
  const { description } = useExtractPhotoMetadata(photo);

  return (
    <Head>
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Next Splash" />
      <meta name="twitter:description" content="Beautiful free photos" />
      {photo && (
        <>
          {" "}
          <meta name="twitter:image" content={photo.urls.regular} />
          <meta name="twitter:image:alt" content={description} />
        </>
      )}

      {/* OpenGraph tags */}
      <meta property="og:title" content="Next Splash" />
      <meta property="og:description" content="Beautiful free photos" />
      <meta property="og:url" content={origin} />
      <meta property="og:type" content="website" />

      {photo && (
        <>
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content={`${photo.width}`} />
          <meta property="og:image:height" content={`${photo.height}`} />
          <meta property="og:image" content={photo.urls.regular} />
          <meta property="og:image:alt" content={description} />
        </>
      )}
    </Head>
  );
};

PhotosPageHead.propTypes = {
  photo: PropTypes.object.isRequired,
  origin: PropTypes.string.isRequired,
};
