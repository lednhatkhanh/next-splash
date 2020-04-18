import React from "react";
import PropTypes from "prop-types";
import {
  Paper,
  makeStyles,
  Avatar,
  Typography,
  Button,
  Hidden,
} from "@material-ui/core";
import {
  Favorite as FavoriteIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from "@material-ui/icons";

import { AppLink } from "./AppLink";
import { useExtractPhotoMetadata, useTriggerDownloadPhoto } from "~/hooks";

export const PhotoItem = ({ photo }) => {
  const classes = useStyles();
  const [downloadPhoto] = useTriggerDownloadPhoto(photo);
  const { username, description } = useExtractPhotoMetadata(photo);

  const handleDownloadPhoto = React.useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      downloadPhoto();
    },
    [downloadPhoto]
  );

  return (
    <AppLink href="/photos/[id]" as={`/photos/${photo.id}`}>
      <Paper className={classes.paper} elevation={6}>
        <img
          className={classes.img}
          src={photo.urls.regular}
          alt={description}
        />

        <div className={classes.overlay}>
          <div className={classes.userInfo}>
            <Avatar
              className={classes.avatar}
              src={photo.user.profile_image.medium}
              alt={username}
            />

            <Hidden mdDown>
              <Typography component="span" variant="body1">
                {photo.user.name}
              </Typography>
            </Hidden>
          </div>

          <div className={classes.actions}>
            <Button startIcon={<FavoriteIcon />}>{photo.likes}</Button>

            <Button onClick={handleDownloadPhoto}>
              <GetAppIcon />
            </Button>

            <Button>
              <ShareIcon />
            </Button>
          </div>
        </div>
      </Paper>
    </AppLink>
  );
};

PhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    width: "100%",
    height: "auto",
    overflow: "hidden",
    display: "block",
    "&:hover": {
      cursor: "zoom-in",
      "& > $overlay": {
        opacity: 1,
        visibility: "visible",
      },
    },
  },
  img: {
    width: "100%",
    height: "auto",
    maxWidth: "100%",
    margin: 0,
    padding: 0,
    display: "block",
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(20px)",
    display: "grid",
    gridTemplateRows: "1fr auto",
    alignItems: "center",
    justifyItems: "center",
    visibility: "hidden",
    opacity: 0,
    transition: "all 0.3s ease-in-out",
    [theme.breakpoints.down("md")]: {
      visibility: "visible",
      height: "auto",
      opacity: 1,
      top: "auto",
      bottom: 0,
      gridTemplateRows: "1fr",
      gridTemplateColumns: "auto 1fr",
      gridColumnGap: theme.spacing(1),
      padding: theme.spacing(1),
    },
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  actions: {
    width: "100%",
    display: "flex",
    padding: theme.spacing(1, 2),
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      display: "grid",
      gridTemplateColumns: "repeat(3, auto)",
      justifyItems: "end",
      justifyContent: "end",
      gridColumnGap: theme.spacing(1),
    },
  },
  avatar: {
    marginBottom: 5,
  },
}));
