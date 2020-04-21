import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ReactQueryConfigProvider } from 'react-query';
import NProgress from 'nprogress';
import Router from 'next/router';
import { theme } from '~/lib/theme';

import 'nprogress/nprogress.css';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const reactQueryConfig = {
  refetchOnWindowFocus: false,
};

export default function ReactSplashApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Next Splash</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        <ReactQueryConfigProvider config={reactQueryConfig}>
          {/* CssBaseline kick start an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ReactQueryConfigProvider>
      </ThemeProvider>

      <style jsx global>{`
        #nprogress .bar {
          z-index: 1200;
        }

        html,
        body,
        #__next {
          height: 100%;
        }
      `}</style>
    </>
  );
}
