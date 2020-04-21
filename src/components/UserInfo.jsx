import React from 'react';
import { Avatar, Typography, useTheme, makeStyles } from '@material-ui/core';

import { useSsrMediaQuery } from '~/hooks';

export const UserInfo = ({ user }) => {
  const classes = useStyles();
  const theme = useTheme();
  const mdDown = useSsrMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.userInfoContainer}>
      <Avatar className={classes.avatar} src={user?.profile_image.large} alt={user.name} />

      <div className={classes.nameContainer}>
        <Typography component="span" variant={mdDown ? 'caption' : 'subtitle2'}>
          Photo by
        </Typography>

        <Typography component="div" variant={mdDown ? 'subtitle1' : 'h6'}>
          {user?.name}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  userInfoContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridColumnGap: theme.spacing(2),
  },
  avatar: {
    height: 50,
    width: 50,
    [theme.breakpoints.down('md')]: { height: 40, width: 40 },
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));
