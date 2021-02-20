'use strict';

const express = require('express'), //express
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      GraphQLserver = require('./GraphQL/server'),// Servidor de GraphQL,
      { config } = require('./config'),
      fs = require('fs'),
      http = require('http'),
      https = require('https'),
      app = express(), //creando app
      restFul = require('express-method-override')('_method'),//MethorOverride conversionde Api REST,
      apiRouter = require('./routes/apiRoutes'),
      whitelist = config.enviromentType,
      remotedev = require('redux-devtools-cli'),
      corsOptions = {
        origin: function (origin, callback) {
          if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        },
        credentials: true
      }


//Inicializa como un Middleware el servidor de GraphQL en Express
GraphQLserver.applyMiddleware({
  app,
  cors: corsOptions,
  bodyParserConfig: {
    limit: '2000mb',
    extended: true
  },
});

const httpServer = http.createServer(app)

GraphQLserver.installSubscriptionHandlers(httpServer)

//Inicializan todos los demás servicios de express
app
  .use(cookieParser())
  .use(restFul)
  .use(apiRouter)//Routes de App
  .use(express.static(`../build`))// Declare static folder to be served. It contains the js, images, css,
  .use('/', function (req, res) { //Serve App
  //express.static(`${__dirname}/public`)
    res.sendFile(`index.html`, { root: `../build`})
  })



// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
  httpServer.listen((config.port), () => {
		console.log(`Iniciando Express en el puerto ${config.port}`)
	})
}

if((config.reduxServer) && (config.reduxServer === true)){
  remotedev({});
}

// Instead do export the app:
module.exports = app;