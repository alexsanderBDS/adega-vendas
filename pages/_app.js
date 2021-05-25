import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import {
  AuthProvider,
  ContactsProvider,
  ProdutosProvider,
  VendasProvider,
} from "../context/firebaseContext";
import "../styles/globals.css";
import "../styles/all.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Adega Vendas | App</title>
      </Head>
      <AuthProvider>
        <ProdutosProvider>
          <VendasProvider>
            <ContactsProvider>
              <Component {...pageProps} />
            </ContactsProvider>
          </VendasProvider>
        </ProdutosProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
