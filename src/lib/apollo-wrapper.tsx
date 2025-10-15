"use client";

import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./apollo-client";
import { ReactNode } from "react";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}