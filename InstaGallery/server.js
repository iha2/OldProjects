/*
 *  name:       app.js 
 *  function:   app.js is a main file that contain basic running data and
 *               auxiliary file routing for the applcation
*/


var express = require('express'),
    app     = express();

// test token: 8619424.1fb234f.7269466246614d66b271705b4ec43707


app.use(express.static('public'));

require('./app/routes')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('InstaGallery server listening on http://%s:%s', host, port);
});