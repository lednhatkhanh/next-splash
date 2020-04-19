import React from "react";
import Error from "next/error";
import { useRouter } from "next/router";
import { Container, CircularProgress, makeStyles } from "@material-ui/core";
import { getAbsoluteUrl, fetchAPI, saveToken } from "~/utils";

const OauthCallbackPage = ({ origin }) => {
  const router = useRouter();
  const classes = useStyles();
  const [errorCode, setErrorCode] = React.useState(undefined);

  React.useEffect(() => {
    const fetchAccessToken = async () => {
      const { code } = router.query;

      if (!origin || !code) {
        setErrorCode(401);
        return;
      }

      const { access_token } = await fetchAPI(
        `oauth/request-token?code=${code}&redirect_uri=${origin}/oauth/callback`
      );

      if (!access_token) {
        setErrorCode(401);
        return;
      }

      saveToken(access_token);
      router.replace("/");
    };

    fetchAccessToken();
  }, [origin, router]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  return (
    <Container className={classes.container}>
      <CircularProgress />
    </Container>
  );
};

export const getServerSideProps = async ({ query, req, res }) => {
  const { origin } = getAbsoluteUrl(req);

  return {
    props: {
      origin,
    },
  };
};

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default OauthCallbackPage;
