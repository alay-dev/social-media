import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import Cors from "micro-cors";
import { json } from "micro";

const cors = Cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
});
const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.end();
  }

  req.body = await json(req, { limit: "50mb" });
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
