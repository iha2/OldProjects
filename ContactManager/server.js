
'use strict';

var connection = require('./main-connection'),
    Routers = require('./app/routes/Router'),
    path = require('path'),
    bodyParser = require('body-parser');

connection.app.use(bodyParser.json());  // to support JSON-encoded bodies
connection.app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

connection.app.use(connection.express.static(__dirname + '/public'));

connection.app.use('/login', Routers.LoginRouter);
connection.app.use('/signup', Routers.SignUpRouter);

connection.app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/app/index.html'));
});

connection.server.listen(3000);
// console.log(io);
// var chris = new User({
//   email: "chris.@yahoo.com",
//   firstname: "chris",
//   username: "christopher",
//   password: "son of sam",
//   name: 'Chris' 
// });

// var john = new User({
//   username: 'john hancock',
//   password: 'password' 
// });



// User.find({}, function (err, users) {
//     if (err) throw err;
//     console.log(users);
// })

// console.log(chris);
// console.log(john);

// chris.save(function (err) {
//     if (err) throw err;
// });

