import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Twitter as TwitterIcon, Facebook as FacebookIcon } from '@material-ui/icons';
import queryString from 'query-string';
import { DeviceInfoContext } from '~/containers';

export const ShareMenu = ({ anchorEl, open, photo, onClose }) => {
  const { origin } = React.useContext(DeviceInfoContext);
  const sharePayload = React.useMemo(
    () => ({ url: `${origin}/photos/${photo.id}`, text: `A photo of ${photo.user.name}` }),
    [origin, photo.id, photo.user.name],
  );

  const triggerShareLink = (leading, parsed) => {
    const href = `${leading}?${queryString.stringify(parsed)}`;
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const handleTweet = () => {
    triggerShareLink('https://twitter.com/intent/tweet', {
      text: sharePayload.text,
      url: sharePayload.url,
    });
  };

  const handleShareFacebook = () => {
    triggerShareLink('https://www.facebook.com/sharer/sharer.php', {
      quote: sharePayload.text,
      u: sharePayload.url,
    });
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={handleTweet}>
        <ListItemIcon>
          <TwitterIcon />
        </ListItemIcon>

        <ListItemText>Tweet</ListItemText>
      </MenuItem>

      <MenuItem onClick={handleShareFacebook}>
        <ListItemIcon>
          <FacebookIcon />
        </ListItemIcon>

        <ListItemText>Share</ListItemText>
      </MenuItem>
    </Menu>
  );
};

ShareMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
};
