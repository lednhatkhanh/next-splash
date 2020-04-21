import React from 'react';
import { Typography } from '@material-ui/core';
import { StatisticsItem } from './StatisticsItem';

export const ExifStatisticsItem = ({ label, icon, content }) => {
  return (
    <StatisticsItem label={label} icon={icon}>
      <Typography component="div" variant="body2">
        {content ?? '-'}
      </Typography>
    </StatisticsItem>
  );
};
