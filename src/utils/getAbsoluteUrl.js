// Extracted from https://github.com/jekrb/next-absolute-url/blob/master/index.ts
export const getAbsoluteUrl = (req) => {
  let host = req?.headers.host ?? window.location.host;
  let protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:';

  if (typeof req?.headers['x-forwarded-host'] === 'string') {
    host = req?.headers['x-forwarded-host'];
  }

  if (typeof req?.headers['x-forwarded-proto'] === 'string') {
    protocol = `${req?.headers['x-forwarded-proto']}:`;
  }

  return {
    protocol,
    host,
    origin: protocol + '//' + host,
  };
};
