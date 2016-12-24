
module.exports = function(app, data) {

    //var socket = require('./app/sockets')(app);

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });


    app.get('/messages', function(req, res) {
        res.send(data.messages);
    });

    app.get('/users', function(req, res) {
        res.send(data.users);
    })
}
