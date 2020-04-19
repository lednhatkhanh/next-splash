import React from "react";
import PropTypes from "prop-types";

export const AuthContext = React.createContext({
  loggedIn: false,
  setLoggedIn: () => {},
});

export const AuthProvider = ({ children, value }) => {
  const [loggedIn, setLoggedIn] = React.useState(value.loggedIn);
  const initialValue = React.useMemo(() => ({ loggedIn, setLoggedIn }), [
    loggedIn,
  ]);

  return (
    <AuthContext.Provider value={initialValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  value: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
};
