import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const graphqlUrl = isProduction 
    ? 'https://student-portal-zr8i.vercel.app/api/graphql'
    : 'http://localhost:3000/api/graphql';

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
};

export const apolloClient = createApolloClient();
export const client = apolloClient;