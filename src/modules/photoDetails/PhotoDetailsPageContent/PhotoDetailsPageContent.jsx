import React from 'react';
import { Container, makeStyles, useTheme } from '@material-ui/core';

import { Layout, DynamicPhotoStatisticsModal } from '~/components';
import { UserInfo } from '~/components';
import { useCreatePhotoSrcSet, useExtractPhotoMetadata, useTriggerDownloadPhoto } from '~/hooks';

import { useToggleLikePhotoMutation } from './useToggleLikePhotoMutation';
import { useFetchPhotoDetails } from './useFetchPhotoDetails';
import Actions from './Actions';

const photoWidths = [900, 1000, 1300];

export const PhotoDetailsPageContent = ({ photoDetails: initialPhotoDetails }) => {
  const classes = useStyles();
  const { data: photoDetails } = useFetchPhotoDetails(initialPhotoDetails);
  const toggleLikePhoto = useToggleLikePhotoMutation(photoDetails);
  const { description } = useExtractPhotoMetadata(photoDetails);
  const [downloadPhoto] = useTriggerDownloadPhoto(photoDetails);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const srcSet = useCreatePhotoSrcSet(photoDetails, photoWidths);
  const sizes = useGetPhotoSizes();

  const handleShowStatisticsModal = React.useCallback(() => {
    dispatch({ type: 'SET_SHOW_STATISTICS', isShowingStatistics: true });
  }, []);

  const handleCloseStatisticsModal = React.useCallback(() => {
    dispatch({ type: 'SET_SHOW_STATISTICS', isShowingStatistics: false });
  }, []);

  const handleDownloadPhoto = () => {
    downloadPhoto();
  };

  const handleToggleLikePhoto = () => {
    toggleLikePhoto({
      id: photoDetails.id,
      type: photoDetails.liked_by_user ? 'unlike' : 'like',
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
            srcSet={srcSet}
            alt={description}
            sizes={sizes}
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
        <DynamicPhotoStatisticsModal photoDetails={photoDetails} onClose={handleCloseStatisticsModal} />
      )}
    </Layout>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: 'calc(100vh - 64px)',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gridRowGap: theme.spacing(2),
    padding: theme.spacing(2, 0),
  },
  photoCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    boxShadow: theme.shadows[6],
    borderRadius: '4px',
  },
}));

const useGetPhotoSizes = () => {
  const theme = useTheme();
  const sizes = React.useMemo(
    () =>
      [
        `(min-width: ${theme.breakpoints.values['lg']}px) 1216px`,
        `(min-width: ${theme.breakpoints.values['sm']}px) calc(100vw - 48px)`,
        `calc(100vw - 32px)`,
      ].join(', '),
    [theme],
  );

  return sizes;
};

const initialState = {
  isDownloading: false,
  isShowingStatistics: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DOWNLOADING': {
      return {
        ...state,
        isDownloading: action.isDownloading,
      };
    }
    case 'SET_SHOW_STATISTICS': {
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
