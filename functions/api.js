var functions = require('firebase-functions');
var jsonserver  = require('json-server');
var mockdb      = require('./db');

var api = jsonserver.create();
var router = jsonserver.router(mockdb());
var middlewares = jsonserver.defaults();

api.use(middlewares);
api.use(jsonserver.bodyParser)
api.use('/', router);

module.exports = api;