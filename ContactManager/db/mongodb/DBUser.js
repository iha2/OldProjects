
var MongooseInterface = require('./Connection'),
    mongoose = MongooseInterface.mongoose,
    mongodb = MongooseInterface.mongodb,
    Schema = mongoose.Schema;

var userSchema = new Schema({ 
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: {type: String },
  password: { type: String, required: true },
  contacts : [{ type : Schema.ObjectId, ref: 'Contact' }]
});

var DBUser = mongoose.model('User', userSchema);

// DBUser.find({}, function (err, docs) {
//     console.log(docs);
// });

module.exports = DBUser;