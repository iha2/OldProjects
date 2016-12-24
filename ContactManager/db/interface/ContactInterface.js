
var mongoose = require('mongoose'),
    DBUser = require("../mongodb/DBUser"),
    DBTables = require('../mongodb/DBTables');
    DBContact = DBTables.Contact,
    DBUser = DBTables.User;

var ContactInterface = function () {

    var get = function (criteriaObj) {
        
        var searchParameters;
        // console.log("criteria obj")
        // console.log(criteriaObj);

        if (typeof criteriaObject === "object") {
            searchParameters = criteriaObj;
        } else if (typeof criteriaObject === "array") {
            searchParameters = {    
                '_id': { $in: criteriaObj }
            };
        }

        return new Promise(function (resolve, reject) {
            // console.log("parameter");
            // console.log(searchParameters);
            DBContact.find(searchParameters, function(err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    };

    var add = function (user_id, contact) {
        console.log("got called with id ..." + user_id);
        var newContact = new DBContact({
            firstname: contact.firstname,
            lastname: contact.lastname,
            phone: contact.phone,
            email: contact.email,
            address: contact.address,
            family: contact.family,
            friend: contact.friend,
            colleague: contact.colleague
        });

        var savedAction = new Promise(function (resolve, reject) {

                // Add contact to the related user, then save contact.
                DBUser.find({ '_id': user_id }, function(err, user) {
                    console.log("ran promise resolution");
                    console.log(newContact);
                    user[0].contacts.push(mongoose.Types.ObjectId(newContact._id));
                    console.log(user);

                    user[0].save(function (err) {
                        if (err) throw err;

                        newContact.save(function (err) {
                            if (err) throw reject({success: false, data: err});

                            resolve({ success : true, data: newContact.toObject()});
                        });
                    });
                });
            });
        return savedAction;
    };


    var update = function (updatedContact) {
        var updateAction = new Promise(function (resolve, reject) {

            var id = {'_id': updatedContact.id }
            delete updatedContact['id'];

            DBContact.update(id, updatedContact, function (err, doc) {
                console.log("here");
                console.log(err, doc);
                if (err) throw reject(err);
                return resolve(doc); 
            });
        });

        return updateAction;
    }

    var remove = function (contactID) {
        var removeAction = new Promise(function (resolve, reject) {
            var idObj = {id: id}
            resolve(DBContact.remove(idObj));
        });
    }

    return {
        get : get,
        add : add,
        update: update,
        remove: remove
    }
}

module.exports = ContactInterface;