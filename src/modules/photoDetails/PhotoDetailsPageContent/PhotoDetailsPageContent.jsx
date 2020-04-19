import React from "react";
import { Container, makeStyles } from "@material-ui/core";

import { Layout, DynamicPhotoStatisticsModal } from "~/components";
import { UserInfo } from "~/components";
import { useExtractPhotoMetadata, useTriggerDownloadPhoto } from "~/hooks";

import { useToggleLikePhotoMutation } from "./useToggleLikePhotoMutation";
import { useFetchPhotoDetails } from "./useFetchPhotoDetails";
import Actions from "./Actions";

export const PhotoDetailsPageContent = ({
  photoDetails: initialPhotoDetails,
}) => {
  const classes = useStyles();
  const { data: photoDetails } = useFetchPhotoDetails(initialPhotoDetails);
  const toggleLikePhoto = useToggleLikePhotoMutation(photoDetails);
  const { description } = useExtractPhotoMetadata(photoDetails);
  const [downloadPhoto] = useTriggerDownloadPhoto(photoDetails);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleShowStatisticsModal = React.useCallback(() => {
    dispatch({ type: "SET_SHOW_STATISTICS", isShowingStatistics: true });
  }, []);

  const handleCloseStatisticsModal = React.useCallback(() => {
    dispatch({ type: "SET_SHOW_STATISTICS", isShowingStatistics: false });
  }, []);

  const handleDownloadPhoto = () => {
    downloadPhoto();
  };

  const handleToggleLikePhoto = () => {
    toggleLikePhoto({
      id: photoDetails.id,
      type: photoDetails.liked_by_user ? "unlike" : "like",
    });
  };

  return (
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

        <Actions
          photoDetails={photoDetails}
          onToggleLike={handleToggleLikePhoto}
          onDownload={handleDownloadPhoto}
          onShowStatistics={handleShowStatisticsModal}
        />
      </Container>

      {state.isShowingStatistics && (
        <DynamicPhotoStatisticsModal
          photoDetails={photoDetails}
          onClose={handleCloseStatisticsModal}
        />
      )}
    </Layout>
  );
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
