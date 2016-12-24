/*
 * Server side for chat server
 */

 var app         = require('express')(),
 http            = require('http').Server(app),
 express         = require('express'),
cookieParser     = require('cookie-parser'),
 io              = require('socket.io')(http),
 sharedsession   = require('express-socket.io-session'),
 session         = require('express-session')({ secret: 'pass', resave: true, saveUninitialized: true});

 app.use(express.static('public'));
 app.use(cookieParser());


// render page on port
http.listen(8001, function() {
    console.log('listening on 8001');
});
 app.use(session);
 io.use(sharedsession(session));

// global variables that stores users information
var data = {
    users: [],
    messages: []
}

// import all the working app modules
require('./app/routes')(app, data);
require('./app/sockets')(io, data);

