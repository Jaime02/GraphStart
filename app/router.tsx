import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  routerWithApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-tanstack-start";
import { HttpLink, split } from "@apollo/client/index.js";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import NotFound from "@/app/components/not_found";
const VITE_GRAPHQL_WS_URL = import.meta.env.VITE_GRAPHQL_WS_URL;

export function createRouter() {
  const httpLink = new HttpLink({ uri: "/api/graphql" });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${VITE_GRAPHQL_WS_URL}/api/subscriptions`,
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            users: {
              merge: false,
            },
          },
        },
      },
    }),
  });

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {} as any,
    defaultNotFoundComponent: NotFound
  });

  return routerWithApolloClient(router, apolloClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
