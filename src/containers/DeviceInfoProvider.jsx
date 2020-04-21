import React from 'react';

export const DeviceInfoContext = React.createContext({
  deviceType: null,
  viewportWidth: null,
  origin: '',
});

export const DeviceInfoProvider = ({ children, value }) => {
  return <DeviceInfoContext.Provider value={value}>{children}</DeviceInfoContext.Provider>;
};
