import React from "react";
import { useInfiniteQuery } from "react-query";
import { PhotosList, Layout } from "~/components";
import { fetchPhotos } from "~/fetchers";
import { getDeviceInfo, getAbsoluteUrl } from "~/utils";
import { DeviceInfoProvider } from "~/containers";
import Head from "next/head";

const HomePage = ({ photos: initialPhotos, deviceInfo, origin }) => {
  const { fetchMore, data, isFetchingMore } = useInfiniteQuery({
    queryKey: "photos",
    queryFn: fetchPhotos,
    config: {
      getFetchMore(_lastPage, allPages) {
        return {
          page: allPages.length + 1,
        };
      },
      initialData: [initialPhotos],
    },
  });
  const latestInitialPhoto = initialPhotos[initialPhotos.length - 1];
  const latestInitialPhotoDescription = latestInitialPhoto
    ? latestInitialPhoto.alt_description ??
      latestInitialPhoto.description ??
      `A photo of @${latestInitialPhoto.user.usernmame}`
    : undefined;

  const photos = React.useMemo(() => data.flat(1), [data]);

  const handleFetchMorePhotos = React.useCallback(() => {
    fetchMore();
  }, [fetchMore]);

  return (
    <>
      <Head>
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="React Splash" />
        <meta
          name="twitter:description"
          content="Beautiful free photos everyday"
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
        <meta property="og:title" content="React Splash" />
        <meta
          property="og:description"
          content="Beautiful free photos everyday"
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
        <Layout>
          <PhotosList
            photos={photos}
            isFetchingMore={isFetchingMore}
            onFetchMore={handleFetchMorePhotos}
          />
        </Layout>
      </DeviceInfoProvider>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const photos = await fetchPhotos("photos", { page: 1 }, req);
  const deviceInfo = getDeviceInfo(req);
  const { origin } = getAbsoluteUrl(req);

  return {
    props: {
      photos,
      deviceInfo,
      origin,
    },
  };
};

export default HomePage;
