'use strict';

const express = require('express'), //express
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      { ApolloServer, gql, PubSub } = require('apollo-server-express'),
      pubsub = new PubSub(),
      typeDefs = require('./schema'), // construye un schema, usando GraphQL
      resolvers = require('./resolvers'), // construye los resolvers de GraphQL
      server = new ApolloServer({
        // These will be defined for both new or existing servers
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
          pubsub.ee.setMaxListeners(0)
          return { req, res, pubsub }
        },
        introspection: true,
        playground: true,
      }),
      app = express() //creando app
      app
        .use(cookieParser())

server.applyMiddleware({
  app
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
	app.listen((process.env.PORT || 4000), () => {
		console.log(`Iniciando Express en el puerto 4000${server.graphqlPath}`) /*${app.get('port')}*/
	})
}

// Instead do export the app:
module.exports = server;