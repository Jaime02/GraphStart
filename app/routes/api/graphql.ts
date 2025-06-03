import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import resolvers from "@/app/graphql/resolvers";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginUsageReportingDisabled } from '@apollo/server/plugin/disabled';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

const GRAPHQL_PORT = Number(process.env.GRAPHQL_PORT) || 4000;

const schemaPath = new URL("../../graphql/schema.graphql", import.meta.url);
const typeDefs = readFileSync(schemaPath, "utf-8");

const httpServer = createServer();

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/api/subscriptions",
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginUsageReportingDisabled(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

httpServer.listen(GRAPHQL_PORT, () => {
  console.log(
    `🚀 GraphQL server ready at ${process.env.VITE_GRAPHQL_WS_URL}/api/graphql`
  );
  console.log(
    `🚀 Subscriptions ready at ${process.env.VITE_GRAPHQL_WS_URL}/api/subscriptions`
  );
});

export const APIRoute = createAPIFileRoute("/api/graphql")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const variablesParam = url.searchParams.get("variables");
    const operationName = url.searchParams.get("operationName");
    let variables;

    if (variablesParam) {
      try {
        variables = JSON.parse(variablesParam);
      } catch (e) {
        return new Response("Variables are not valid JSON.", { status: 400 });
      }
    }

    if (!query) {
      return new Response("Query is missing.", { status: 400 });
    }

    const response = await server.executeOperation({
      query: query,
      variables: variables,
      operationName: operationName || undefined,
    });
    return Response.json(response);
  },

  POST: async ({ request }) => {
    let body: { query: string; variables: object; operationName: string };
    try {
      body = await request.json();
    } catch (error) {
      return new Response("Invalid JSON body.", { status: 400 });
    }

    const execution = await server.executeOperation({
      query: body.query,
      variables: body.variables,
      operationName: body.operationName,
    });

    if (execution.body.kind == "incremental") {
      return new Response("TO DO: Unsupported incremental request mode", {
        status: 500,
      });
    }

    const result = execution.body?.singleResult;
    if (!result) {
      return new Response("No execution result returned.", { status: 500 });
    }

    return Response.json(result);
  },
});
