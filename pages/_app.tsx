import type { AppProps } from "next/app";
import "../styles/globals.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo";
import { AuthenticationProvider } from "../context/authentication";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthenticationProvider>
        <Component {...pageProps} />
      </AuthenticationProvider>
    </ApolloProvider>
  );
}
