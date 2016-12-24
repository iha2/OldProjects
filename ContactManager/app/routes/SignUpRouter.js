'use strict';

var Controllers = require('../controllers/Controllers'),
    SignUpController = Controllers.SignUpController(),
    path = require('path'),
    fs = require('fs'),
    SignUpRouter = require("express").Router();

SignUpRouter.post('/validate', function(req, res) {
    var email = req.body.username;

    SignUpController.AuthenticateNewUser({email: email},
        function(err, user) {
            if (err) throw err;
            
            if (user.validation) {
                if (user.data !== undefined) {
                    res.json({
                        validation: false,
                        errorType: "user",
                        data: "User email already exists in Contact Manager. \n Please choose another username"
                    });
                } else {
                    res.json({
                        validation: true,
                        data: []
                    });
                }
            } else {
                res.json({
                    validation: true,
                    data: []
                });
            }
        });
});

SignUpRouter.post('/register', function (req, res) {
    var userData = {
        username : req.body.username,
        password : req.body.password,
        firstname : req.body.firstname,
        lastname : req.body.lastname
    }
    SignUpController.RegisterUser(userData).then(function(result) {
        if (result.success) {
            res.json({
                validation: true
            });
        } else {
            console.log("break something");
        }
    });
});

module.exports = SignUpRouter;

 

