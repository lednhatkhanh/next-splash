import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useExtractPhotoMetadata } from '~/hooks';

export const SearchPageHead = ({ photo, origin }) => {
  const router = useRouter();
  const { description } = useExtractPhotoMetadata(photo);

  return (
    <Head>
      <title>{router.query.query} - Next Splash</title>

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Next Splash" />
      <meta name="twitter:description" content={`Photos about ${router.query.query}`} />
      {photo && (
        <>
          {' '}
          <meta name="twitter:image" content={photo.urls.regular} />
          <meta name="twitter:image:alt" content={description} />
        </>
      )}

      {/* OpenGraph tags */}
      <meta property="og:title" content="Next Splash" />
      <meta property="og:description" content={`Photos about ${router.query.query}`} />
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

SearchPageHead.propTypes = {
  photo: PropTypes.object.isRequired,
  origin: PropTypes.string.isRequired,
};
