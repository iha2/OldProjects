
var express = require('express'),
    http = require('http'),
    User = require('./app/models/Model').User,
    app = express(),
    server = http.createServer(app),
    io = require('socket.io')(server);

module.exports = {
    express: express,
    app: app,
    server: server,
    io: io
};