import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import "@//common/styles/global.scss";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>title</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
