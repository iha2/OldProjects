'use strict';

var Model = require("../models/Model"),
    User = Model.User;

var AuthenticationController = (function () {

    var authenticate = function (credentials, callback) {
        // console.log(credentials);
        var userPromise = User.getUserByEmail(credentials.email);

        if (typeof callback !== "function")
            throw console.log("no function was passed in last argument of Authenticate");

        userPromise.then(function (users) {
            // console.log("userFound");
            // console.log(users);
            // console.log(credentials);
            // console.log(users.length);
            if (users.length === 1) {
                // console.log("passwords");
                // console.log(users[0].password);
                // console.log(credentials.password);
                if (users[0].password === credentials.password) {
                    var user = new User(users[0].email, 
                                        users[0].firstname,
                                        users[0].lastname,
                                        users[0].contacts);
                    user.id = users[0]._id;
                    // console.log("found right password");
                    return callback(null, { validation: true, data: users[0] });
                } else {
                    return callback(null, { validation: true, data: undefined })
                }
            } else if (users.length > 1) {
                return callback("There are too many users returned");
            } else {
                return callback(null, { validation: false, data: [] });
            }
        })
        .catch(function(reason) {
            return callback(reason);
        });
    }

    return {
        authenticate : authenticate
    }
})();

module.exports = AuthenticationController;