
module.exports = function(app) {

    //var socket = require('./app/sockets')(app);

    app.get('/', function(req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });
}
