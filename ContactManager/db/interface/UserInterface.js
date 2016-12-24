
var DBUser = require('../mongodb/DBUser');

var UserInterface = function () {

    var findBy = function (criteriaObj) {
        
        return new Promise(function (resolve, reject) {
                DBUser.find(criteriaObj, function(err, user) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            });
    };

    var save = function (user) {
        var newUser = new DBUser({
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
        });

        var savedAction = new Promise(function (resolve, reject) {
            newUser.save(function (err) {
                if (err) throw reject({success: false, data: err});
                resolve({ success : true, data: "" })
            });
        });

        return savedAction;
    }
    return {
        findBy : findBy,
        save: save
    }
};

module.exports = UserInterface;