const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const User = new mongoose.Schema({
   firstname: {
    type:String,
    required: true
   },
   lastname:{
    type: String,
    required: true
   },
   username: {
        type: String,
        unique: true 
    },
   password: {
    type: String
   }
});
User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User);