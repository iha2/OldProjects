
var mongoose = require('mongoose'),
    mongodb = require('mongodb'),
    Schema = mongoose.Schema;

var CONNECTION_URL = 'mongodb://localhost/';
var DB_NAME = 'ContactManger'; 

mongoose.connect(CONNECTION_URL + DB_NAME);

var Connection = {
    mongoose : mongoose,
    mongodb: mongodb
}

module.exports = Connection;