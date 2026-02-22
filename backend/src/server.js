import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/index.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: authenticate(req) }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen(process.env.PORT, () => {
    console.log(`SERVER READY at http://localhost:${process.env.PORT}/graphql`);
  });
}

startServer();
