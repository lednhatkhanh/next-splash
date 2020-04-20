import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  makeStyles,
  List,
  useScrollTrigger,
  Slide,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";

import { AppLink } from "./AppLink";
import { SearchBar } from "./SearchBar";
import { AuthContext } from "~/containers";
import { deleteToken, fetchAPI } from "~/utils";
import { useQuery } from "react-query";

const fetchMeQuery = (key, { req = undefined } = { req: undefined }) => {
  const promise = fetchAPI("me", {
    req,
  });

  return promise;
};

export const Layout = ({ children, className }) => {
  const classes = useStyles();
  const [isDrawerOpening, setIsDrawerOpening] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();
  const trigger = useScrollTrigger();
  const { loggedIn, setLoggedIn } = React.useContext(AuthContext);
  const { data: userProfile } = useQuery({
    queryKey: loggedIn && "me",
    queryFn: fetchMeQuery,
  });
  const userNameProps = React.useMemo(() => ({ className: classes.userName }), [
    classes.userName,
  ]);

  const handleDrawerClose = React.useCallback(() => {
    setIsDrawerOpening(false);
  }, []);

  const handleDrawerOpen = React.useCallback(() => {
    setIsDrawerOpening(true);
  }, []);

  const handleMenuButtonClick = () => {
    handleDrawerOpen();
  };

  const handleStartSearching = React.useCallback(() => {
    setIsSearching(true);
  }, []);

  const handleStopSearching = React.useCallback(() => {
    setIsSearching(false);
  }, []);

  const handleSearchButtonClick = () => {
    handleStartSearching();
  };

  const handleSearch = (value) => {
    router.push(`/search/${value}`);
  };

  const handleSignOut = () => {
    deleteToken();
    setLoggedIn(false);
    handleDrawerClose();
  };

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar position="sticky">
          <Toolbar>
            {!isSearching && (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuButtonClick}
                >
                  <MenuIcon />
                </IconButton>

                <div className={classes.spacer} />

                <AppLink className={classes.logoLink} href="/">
                  <img className={classes.logo} src="/camera.svg" alt="Logo" />
                </AppLink>

                {router.pathname !== "/search/[query]" && (
                  <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="search"
                    onClick={handleSearchButtonClick}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </>
            )}

            {isSearching && (
              <SearchBar
                className={classes.searchBar}
                onClose={handleStopSearching}
                onSearch={handleSearch}
              />
            )}
          </Toolbar>
        </AppBar>
      </Slide>

      <Drawer open={isDrawerOpening} onClose={handleDrawerClose}>
        <List className={classes.drawerList}>
          {!loggedIn && (
            <NextLink href="/oauth" passHref>
              <ListItem component="a" button>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>

                <ListItemText>Sign in</ListItemText>
              </ListItem>
            </NextLink>
          )}

          {loggedIn && (
            <>
              {userProfile && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={userProfile.name}
                      src={userProfile.profile_image.medium}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primaryTypographyProps={userNameProps}
                    secondaryTypographyProps={userNameProps}
                    primary={userProfile.name}
                    secondary={`@${userProfile.username}`}
                  />
                </ListItem>
              )}

              <ListItem button onClick={handleSignOut}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>

                <ListItemText>Sign out</ListItemText>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Container className={className} component="main" maxWidth="lg">
        {children}
      </Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  logo: { width: 36, height: 36 },
  logoLink: {
    position: "absolute",
    left: "50%",
    top: "auto",
    transform: "translateX(-50%)",
  },
  drawerList: { width: 250 },
  searchBar: { flex: 1 },
  spacer: { flex: 1 },
  userName: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));
