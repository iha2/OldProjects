"use strict";

var DBInterface = require('../../db/interface/Interface'),
    mongoose = require('mongoose'),
    UserInterface = DBInterface.UserInterface();

var User = function (username, firstname, lastname) {
    
    this.email = username;
    this.firstname = firstname;
    this.lastname = lastname;

    if (arguments.length === 4) {
        if (typeof(arguments[3]) === "array" || typeof(arguments[3]) === "object") {
            this.contacts = arguments[3];
        } else if (typeof(arguments[3]) === "string") {
            this.password = arguments[3];
        }
    }
    else if (arguments.length == 5) {
        this.password = arguments[3];
        this.contacts = arguments[4];
    }
    // console.log(this);
    return this;
}

User.getUserByEmail = function (email) {
        return UserInterface.findBy({ email: email });
}

User.byId = function (user_id) {
    console.log("passed value " + user_Id + " of " + typeof(user_id));
    if (typeof user_id === 'number') {
        console.log("passed " + user_id + "as user id." );
        return UserInterface.findBy({ _id: user_id});
    }
    else if (typeof user_id === 'array') {
        var MongooseObjectIds = user_id.map(function (id) {
             mongoose.Types.ObjectId(id)
        });
        return UserInterface.findBy({'_id': { $in: MongooseObjectIds}});
    }
}

User.registerUser = function (user) {
    return UserInterface.save(user);
}

module.exports = User;
