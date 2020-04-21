import React from 'react';
import mediaQuery from 'css-mediaquery';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { DeviceInfoContext } from '~/containers';

export const useSsrMediaQuery = (query, options = {}) => {
  const theme = useTheme();
  const { viewportWidth, deviceType } = React.useContext(DeviceInfoContext);

  const ssrMatchMedia = React.useCallback(
    (query) => {
      let width = viewportWidth ? parseInt(viewportWidth) : null;

      if (deviceType) {
        width = {
          mobile: theme.breakpoints.width('xs'),
          tablet: theme.breakpoints.width('sm'),
          desktop: theme.breakpoints.width('md'),
        }[deviceType];
      }

      return {
        matches: mediaQuery.match(query, {
          width,
        }),
      };
    },
    [deviceType, theme.breakpoints, viewportWidth],
  );

  return useMediaQuery(query, {
    ssrMatchMedia,
    ...options,
  });
};
