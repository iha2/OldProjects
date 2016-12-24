/*
 * Server side for main website
 */

 var app        = require('express')();
 var http       = require('http').Server(app);
 var express    = require('express');

 app.use(express.static('public'));

 app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
 });

 http.listen(8000, function() {
    console.log('lisening on 8000')
 })
