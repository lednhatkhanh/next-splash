import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { makeStyles, Container, Button } from "@material-ui/core";
import {
  FavoriteBorderRounded as FavoriteOutlinedIcon,
  GetAppOutlined as GetAppOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@material-ui/icons";
import { getDeviceInfo, redirect, getAbsoluteUrl } from "~/utils";
import { fetchPhotoDetails } from "~/fetchers";
import { useExtractPhotoMetadata, useTriggerDownloadPhoto } from "~/hooks";
import { Layout, UserInfo } from "~/components";
import { DeviceInfoProvider } from "~/containers";
import { DynamicPhotoStatisticsModal } from "~/components/PhotoStatisticsModal";

const PhotoDetailPage = ({ photoDetails, deviceInfo, origin }) => {
  const { description } = useExtractPhotoMetadata(photoDetails);
  const classes = useStyles();
  const [downloadPhoto] = useTriggerDownloadPhoto(photoDetails);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleShowPhotoStatisticsModal = React.useCallback(() => {
    dispatch({ type: "SET_SHOW_STATISTICS", isShowingStatistics: true });
  }, []);

  const handlePhotoStatisticsModalClose = React.useCallback(() => {
    dispatch({ type: "SET_SHOW_STATISTICS", isShowingStatistics: false });
  }, []);

  const handleDownloadPhoto = () => {
    downloadPhoto();
  };

  return (
    <>
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
        <meta
          property="og:url"
          content={`${origin}/photos/${photoDetails.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content={`${photoDetails.width}`} />
        <meta property="og:image:height" content={`${photoDetails.height}`} />
        <meta property="og:image" content={photoDetails.urls.regular} />
        <meta property="og:image:alt" content={description} />
      </Head>

      <DeviceInfoProvider value={deviceInfo}>
        <Layout>
          <Container className={classes.container} maxWidth="lg">
            <UserInfo user={photoDetails.user} />

            <div className={classes.photoCard}>
              <img
                className={classes.image}
                src={photoDetails.urls.regular}
                alt={description}
              />
            </div>

            <div className={classes.actions}>
              <Button size="large" startIcon={<FavoriteOutlinedIcon />}>
                {photoDetails.likes}
              </Button>
              <Button
                aria-label="Download"
                size="large"
                onClick={handleDownloadPhoto}
              >
                <GetAppOutlinedIcon />
              </Button>
              <Button aria-label="Share" size="large">
                <ShareOutlinedIcon />
              </Button>
              <Button
                aria-label="Statistics"
                size="large"
                onClick={handleShowPhotoStatisticsModal}
              >
                <InfoOutlinedIcon />
              </Button>
            </div>
          </Container>

          {state.isShowingStatistics && (
            <DynamicPhotoStatisticsModal
              photoDetails={photoDetails}
              onClose={handlePhotoStatisticsModalClose}
            />
          )}
        </Layout>
      </DeviceInfoProvider>
    </>
  );
};

PhotoDetailPage.propTypes = {
  deviceInfo: PropTypes.object.isRequired,
  photoDetails: PropTypes.object.isRequired,
  origin: PropTypes.string.isRequired,
};

export const getServerSideProps = async ({ req, query, res }) => {
  const photoId = query.id;
  const deviceInfo = getDeviceInfo(req);
  const photoDetails = await fetchPhotoDetails("photo", photoId, req);
  const { origin } = getAbsoluteUrl(req);

  if (photoDetails.errors) {
    redirect("/404", res);
  }

  return {
    props: {
      deviceInfo,
      photoDetails,
      origin,
    },
  };
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(100vh - 64px)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gridRowGap: theme.spacing(2),
    padding: theme.spacing(2, 0),
  },
  photoCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    width: "auto",
    height: "auto",
    boxShadow: theme.shadows[6],
    borderRadius: "4px",
  },
  actions: {
    display: "grid",
    justifyContent: "center",
    gridAutoFlow: "column",
    alignItems: "center",
    gridColumnGap: theme.spacing(3),
  },
}));

const initialState = {
  isDownloading: false,
  isShowingStatistics: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DOWNLOADING": {
      return {
        ...state,
        isDownloading: action.isDownloading,
      };
    }
    case "SET_SHOW_STATISTICS": {
      return {
        ...state,
        isShowingStatistics: action.isShowingStatistics,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default PhotoDetailPage;
