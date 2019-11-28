import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import session from "express-session";
import mongoose from "mongoose";
import express from "express";
import redis from "redis";
import "dotenv/config";

import schemaDirectives from "./directives";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

// To get rid of deprecated warning message when importing morgan
const morgan = require("morgan");

(async function() {
  try {
    const app = express();

    app.disable("x-powered-by");

    const RedisStore = connectRedis(session);
    const client = redis.createClient();

    const store = new RedisStore({ client });

    app.use(
      session({
        store,
        secret: process.env.SESSION_SECRET,
        name: process.env.SESSION_NAME,
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: parseInt(process.env.SESSION_LIFETIME),
          secure: process.env.NODE_ENV === "production",
          sameSite: true
        }
      })
    );

    app.use(
      morgan("combined", {
        skip: (_, res) => res.statusCode < 400
      })
    );

    const databaseConnectionURL = `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
    const databaseOptions = { useNewUrlParser: true, useUnifiedTopology: true };

    mongoose.connect(databaseConnectionURL, databaseOptions);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground:
        process.env.NODE_ENV === "production"
          ? false
          : {
              settings: {
                "request.credentials": "include"
              }
            },
      context: ({ req, res }) => ({ req, res })
    });

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: process.env.APP_PORT }, () =>
      console.log(
        `Server ready at http://localhost:${process.env.APP_PORT}${server.graphqlPath}`
      )
    );
  } catch (err) {
    console.error(err);
  }
})();
