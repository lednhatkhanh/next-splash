import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import {
  FavoriteBorderRounded as FavoriteOutlinedIcon,
  Favorite as FavoriteIcon,
  GetAppOutlined as GetAppOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@material-ui/icons';

import { AuthContext } from '~/containers';
import { ShareMenu } from '~/components';

const Actions = ({ photoDetails, onToggleLike, onShowStatistics, onDownload }) => {
  const classes = useStyles();
  const { loggedIn } = React.useContext(AuthContext);
  const [shareMenuAnchorEl, setShareMenuAnchorEl] = React.useState(null);

  const handleOpenShareMenu = (event) => {
    setShareMenuAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setShareMenuAnchorEl(null);
  };

  return (
    <>
      <div className={classes.actions}>
        <Button
          size="large"
          disabled={!loggedIn}
          startIcon={photoDetails.liked_by_user ? <FavoriteIcon /> : <FavoriteOutlinedIcon />}
          color={photoDetails.liked_by_user ? 'secondary' : undefined}
          onClick={onToggleLike}
        >
          {photoDetails.likes}
        </Button>

        <Button aria-label="Download" size="large" onClick={onDownload}>
          <GetAppOutlinedIcon />
        </Button>

        <Button aria-label="Share" size="large" onClick={handleOpenShareMenu}>
          <ShareOutlinedIcon />
        </Button>

        <Button aria-label="Statistics" size="large" onClick={onShowStatistics}>
          <InfoOutlinedIcon />
        </Button>
      </div>

      <ShareMenu
        photo={photoDetails}
        anchorEl={shareMenuAnchorEl}
        open={!!shareMenuAnchorEl}
        onClose={handleCloseShareMenu}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  actions: {
    display: 'grid',
    justifyContent: 'center',
    gridAutoFlow: 'column',
    alignItems: 'center',
    gridColumnGap: theme.spacing(3),
  },
}));

Actions.propTypes = {
  photoDetails: PropTypes.object.isRequired,
  onToggleLike: PropTypes.func.isRequired,
  onShowStatistics: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default Actions;
