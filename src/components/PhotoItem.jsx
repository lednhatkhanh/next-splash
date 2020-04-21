import React from 'react';
import PropTypes from 'prop-types';
import { Paper, makeStyles, Avatar, Typography, Button, Hidden, useTheme } from '@material-ui/core';
import {
  Favorite as FavoriteIcon,
  FavoriteOutlined as FavoriteOutlinedIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

import { useExtractPhotoMetadata, useTriggerDownloadPhoto, useCreatePhotoSrcSet } from '~/hooks';
import { AuthContext } from '~/containers';
import { AppLink } from './AppLink';
import { ShareMenu } from '~/components';

const photoWidths = Array.from({ length: 10 }, (_v, i) => (i + 3) * 100);

export const PhotoItem = ({ photo, onToggleLike }) => {
  const classes = useStyles();
  const [shareMenuAnchorEl, setShareMenuAnchorEl] = React.useState(null);
  const [downloadPhoto] = useTriggerDownloadPhoto(photo);
  const { username, description } = useExtractPhotoMetadata(photo);
  const { loggedIn } = React.useContext(AuthContext);
  const srcSet = useCreatePhotoSrcSet(photo, photoWidths);
  const sizes = useGetPhotoSizes();

  const handleDownloadPhoto = (event) => {
    event.stopPropagation();
    event.preventDefault();

    downloadPhoto();
  };

  const handleLikeButtonClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    onToggleLike(photo);
  };

  const handleOpenShareMenu = (event) => {
    event.stopPropagation();
    event.preventDefault();

    setShareMenuAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setShareMenuAnchorEl(null);
  };

  return (
    <>
      <AppLink href="/photos/[id]" as={`/photos/${photo.id}`}>
        <Paper className={classes.paper} elevation={6}>
          <img className={classes.img} src={photo.urls.regular} alt={description} sizes={sizes} srcSet={srcSet} />

          <div className={classes.overlay}>
            <div className={classes.userInfo}>
              <Avatar className={classes.avatar} src={photo.user.profile_image.medium} alt={username} />

              <Hidden mdDown>
                <Typography component="span" variant="body1">
                  {photo.user.name}
                </Typography>
              </Hidden>
            </div>

            <div className={classes.actions}>
              <Button
                disabled={!loggedIn}
                startIcon={photo.liked_by_user ? <FavoriteOutlinedIcon /> : <FavoriteIcon />}
                onClick={handleLikeButtonClick}
                color={photo.liked_by_user ? 'secondary' : undefined}
              >
                {photo.likes}
              </Button>

              <Button onClick={handleDownloadPhoto}>
                <GetAppIcon />
              </Button>

              <Button onClick={handleOpenShareMenu}>
                <ShareIcon />
              </Button>
            </div>
          </div>
        </Paper>
      </AppLink>

      <ShareMenu photo={photo} anchorEl={shareMenuAnchorEl} open={!!shareMenuAnchorEl} onClose={handleCloseShareMenu} />
    </>
  );
};

PhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
  onToggleLike: PropTypes.func.isRequired,
};

const useGetPhotoSizes = () => {
  const theme = useTheme();
  const sizes = React.useMemo(
    () =>
      [
        `(min-width: ${theme.breakpoints.values['lg']}px) 389px`,
        `(min-width: ${theme.breakpoints.values['md']}px) calc((100vw - 144px) / 3)`,
        `(min-width: ${theme.breakpoints.values['sm']}px) calc((100vw - 80px) / 2)`,
        `calc(100vw - 32px)`,
      ].join(', '),
    [theme],
  );

  return sizes;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'block',
    '&:hover': {
      cursor: 'zoom-in',
      '& > $overlay': {
        opacity: 1,
        visibility: 'visible',
      },
    },
  },
  img: {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    margin: 0,
    padding: 0,
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(20px)',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    alignItems: 'center',
    justifyItems: 'center',
    visibility: 'hidden',
    opacity: 0,
    transition: 'all 0.3s ease-in-out',
    [theme.breakpoints.down('md')]: {
      visibility: 'visible',
      height: 'auto',
      opacity: 1,
      top: 'auto',
      bottom: 0,
      gridTemplateRows: '1fr',
      gridTemplateColumns: 'auto 1fr',
      gridColumnGap: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    display: 'flex',
    padding: theme.spacing(1, 2),
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, auto)',
      justifyItems: 'end',
      justifyContent: 'end',
      gridColumnGap: theme.spacing(1),
    },
  },
  avatar: {
    marginBottom: 5,
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
    },
  },
}));
