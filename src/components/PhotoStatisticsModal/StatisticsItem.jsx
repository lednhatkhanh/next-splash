import React from 'react';
import { Typography, CircularProgress, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const StatisticsItem = ({ label, icon, children, helperText, loading }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.header}>
        {icon}

        <Typography variant="subtitle2">{label}</Typography>
      </div>

      <Typography className={classes.content} variant="h6" display="block" component="span">
        {children}
      </Typography>

      {loading ? (
        <CircularProgress size={14} />
      ) : helperText ? (
        <Typography className={classes.helperText} variant="body2" display="block" component="span">
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr',
    gridColumnGap: theme.spacing(1),
    alignItems: 'center',
  },
  helperText: { color: grey[400] },
  content: { marginTop: 4 },
}));
