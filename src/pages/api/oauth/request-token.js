import queryString from 'query-string';
import getConfig from 'next/config';
import fetch from 'isomorphic-unfetch';

const { UNSPLASH_ACCESS_KEY, UNSPLASH_SECRET_KEY } = getConfig().serverRuntimeConfig;

const requestTokenAPI = async (req, res) => {
  const { code, redirect_uri } = req.query;

  if (!code || !redirect_uri) {
    res.statusCode = 401;
    res.send({
      error: [!code && 'Missing code', !redirect_uri && 'Missing redirect_uri'],
    });
    return;
  }

  const queryObject = {
    client_id: UNSPLASH_ACCESS_KEY,
    client_secret: UNSPLASH_SECRET_KEY,
    redirect_uri,
    code,
    grant_type: 'authorization_code',
  };

  const data = await fetch(`https://unsplash.com/oauth/token?${queryString.stringify(queryObject)}`, {
    method: 'POST',
  }).then((response) => response.json());

  if (data.access_token) {
    res.send({ access_token: data.access_token });
    return;
  }

  res.statusCode = 401;
  res.send({
    error: [!code && 'Missing code', !redirect_uri && 'Missing redirect_uri'],
  });
};

export default requestTokenAPI;
