import React, { useMemo, Fragment, FC } from "react";
import { AppProps } from "next/app";
import { Page } from "../interfaces/Page";
import { AppProvider } from "@ahri-ui/core";

import "@ahri-ui/core/dist/index.css";

const App: FC<AppProps & { Component: Page }> = ({ Component, pageProps }) => {
  const Layout = useMemo(
    () => Component.layout || Fragment,
    [Component.layout]
  );

  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
};

export default App;
