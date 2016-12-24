'use strict';
var Controllers = require('../controllers/Controllers'),
    LoginController = Controllers.LoginController(),
    Connection = require('../../main-connection'),
    path = require('path'),
    LoginRouter = require("express").Router(),
    io = require(path.join(__dirname , '../../server'));

LoginRouter.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/app/login.html"));
});

LoginRouter.post('/auth', function(req, res) {
    var email = req.body.username;
    var password = req.body.password;

    LoginController.AuthenticateUser({email: email, password: password}, function(err, authData) {
        if (err) throw err;

        // console.log("found user, now loggin in");
 // console.log(authData);
        return LoginController.LoginInitialize(Connection.io, authData, res); 
    });
});

module.exports = LoginRouter;

 

