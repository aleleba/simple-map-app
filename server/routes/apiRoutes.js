'use strict'

var express = require('express'),
    bodyParser = require('body-parser'),//bodyParser conversionde Api REST,
    apiRouter = express.Router()//Router de Express

apiRouter
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))

module.exports = apiRouter