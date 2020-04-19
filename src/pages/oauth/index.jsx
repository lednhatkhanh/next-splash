import React from "react";
import getConfig from "next/config";
import { redirect, getAbsoluteUrl } from "~/utils";
import queryString from "query-string";

const OauthPage = () => {
  return <div>Redirecting...</div>;
};

export const getServerSideProps = ({ req, res }) => {
  const { UNSPLASH_ACCESS_KEY } = getConfig().serverRuntimeConfig;
  const { origin } = getAbsoluteUrl(req);

  const queryObject = {
    redirect_uri: `${origin}/oauth/callback`,
    client_id: UNSPLASH_ACCESS_KEY,
    response_type: "code",
    scope: ["public", "write_likes"],
  };

  redirect(
    `https://unsplash.com/oauth/authorize?${queryString.stringify(queryObject, {
      arrayFormat: "separator",
      arrayFormatSeparator: "+",
    })}`,
    res
  );

  return {
    props: {},
  };
};

export default OauthPage;
