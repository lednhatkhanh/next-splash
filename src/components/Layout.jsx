import React from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  makeStyles,
  List,
  SwipeableDrawer,
  useScrollTrigger,
  Slide,
} from "@material-ui/core";
import { Menu as MenuIcon, Search as SearchIcon } from "@material-ui/icons";
import { AppLink } from "./AppLink";
import { SearchBar } from "./SearchBar";

export const Layout = ({ children, className }) => {
  const classes = useStyles();
  const [isDrawerOpening, setIsDrawerOpening] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const iOS = React.useMemo(
    () => process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent),
    []
  );
  const router = useRouter();
  const trigger = useScrollTrigger();

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

      <SwipeableDrawer
        open={isDrawerOpening}
        onOpen={handleDrawerOpen}
        onClose={handleDrawerClose}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
      >
        <List className={classes.drawerList}></List>
      </SwipeableDrawer>

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
  drawerList: { width: 200 },
  searchBar: { flex: 1 },
  spacer: { flex: 1 },
}));
