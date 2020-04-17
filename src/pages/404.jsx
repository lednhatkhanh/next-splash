import React from "react";
import Head from "next/head";
import { Container, makeStyles } from "@material-ui/core";
import { AppLink } from "~/components";

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Not found</title>
      </Head>

      <Container className={classes.container} maxWidth="lg">
        <img src="/undraw-not-found.svg" alt="Not found" />

        <AppLink href="/" variant="body1">
          Back to home
        </AppLink>
      </Container>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    display: "grid",
    alignContent: "center",
    justifyItems: "center",
    gridAutoFlow: "row",
    gridAutoRows: "min-content",
    gridRowGap: theme.spacing(4),
  },
}));

export default NotFoundPage;
