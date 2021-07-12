import React, { useMemo, Fragment, FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Page } from '../interfaces/Page';
import { theme } from '../theme';

const App: FC<AppProps & { Component: Page }> = ({ Component, pageProps }) => {
  const Layout = useMemo(
    () => Component.layout || Fragment,
    [Component.layout]
  );

  return (
    <ChakraProvider
      theme={{
        ...theme,
        styles: {
          ...theme.styles,
          global: {
            ...theme.styles.global,
            'html, body, #__next': {
              height: 'full',
            },
          },
        },
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
