var mongoose = require('mongoose'),
    mongodb = require('mongodb'),
    Schema = mongoose.Schema;

var contactSchema = new Schema({ 
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: {type: Number, required: true },
  email: {type: String, required: true },
  job : {type: String },
  company : {type: String},
  address: {type: String },
  family: { type: Boolean },
  friend: {type: Boolean },
  colleague: {type: Boolean }
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;