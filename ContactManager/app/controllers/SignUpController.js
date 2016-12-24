'use strict';

var Model = require("../models/Model"),
    Authentication = require("./AuthenticateController"),
    User = Model.User;

var SignUpController = function () {

    var AuthenticateNewUser = function(credentials, callback) {
        Authentication.authenticate(credentials, function (err, data) {

            if (typeof callback == "function")
                return callback(err, data);
        });
    };

    var RegisterUser = function(userData) {
        var newUser = new User(userData.username,
                               userData.firstname,
                               userData.lastname,
                               userData.password);

        return User.registerUser(newUser);
    }

    return {
        AuthenticateNewUser : AuthenticateNewUser,
        RegisterUser : RegisterUser
    }
}

module.exports = SignUpController;