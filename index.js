require('babel-core/register');
require('app-module-path/register');

var server = require('./src/server');
(server.default || server).start();