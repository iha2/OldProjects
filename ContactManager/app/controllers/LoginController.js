'use strict';

var Model = require("../models/Model"),
    Authentication = require("./AuthenticateController"),
    path = require("path"),
    fs = require('fs'),
    SocketInitializer = require('../routes/SocketInitializer'),
    User = Model.User,
    Contact = Model.Contact;

var LoginController = function () {

    var AuthenticateUser = function(credentials, callback) {
        Authentication.authenticate(credentials, function (err, data) {
            // console.log("authenticated");
            // console.log(data);
            if (typeof callback === "function") {
                // console.log("callback called");
                return callback(err, data);
            }
        });
    }

    var LoginInitialize = function (io, user, responder) {
        // console.log(user.validation);
        if (user.validation) {
            // console.log("got in");
            if (user.data === undefined) {
                responderer.json({
                    validation: false,
                    errorType: "pass",
                    data: "User password was incorrect"
                });
            } else {
                // There is a better way to do this.
                // however since I've sure only two files are goin
                // to be sent.
                fs.readFile(path.join(__dirname, '../../public/app/views') + "/user.html", 'utf8', function (err, data) {
                    //console.log(data);
                    if (err) throw err;

                    fs.readFile(path.join(__dirname,
                        '../../public/app/views') + '/contacts.html',
                        'utf8',
                        function (err, contactData) {
                        Contact.get(user.data.contacts).then(function(contacts) {
                            // create a socket.io namespace 
                            // for just a single
                            console.log(contacts);
                            var file = data.toString();
                            user.data.contacts = contacts;
                            SocketInitializer(io, user.data._id);
                            // console.log("should initialize");

                            var contactsTemplate = contactData.toString();    

                            // console.log(contactsTemplate);
                            responder.json({
                                validation: true,
                                user: user.data,
                                contacts: contactsTemplate,
                                file : file
                            });
                        });
                    });
                });  
            }
        } else {
            responder.json({
                validation: false,
                errorType: "user",
                data: "There is no user with that email."
            })
        }
    }


    return {
        AuthenticateUser : AuthenticateUser,
        LoginInitialize : LoginInitialize
    }
}

module.exports = LoginController;