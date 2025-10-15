"use client";

import { ReactNode } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";

interface Props {
  children: ReactNode;
}

export const Providers = ({ children }: Props) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};