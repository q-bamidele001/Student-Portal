import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

import { typeDefs } from "@/graphql/typeDefs";
import { resolvers } from "@/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, 
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
});

export async function GET(request: NextRequest) {
  try {
    return await handler(request);
  } catch (error) {
    console.error("GraphQL GET Error:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handler(request);
  } catch (error) {
    console.error("GraphQL POST Error:", error);
    throw error;
  }
}