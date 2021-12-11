const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : String,
    phonenumber : Number,
    address : String,
    state : String,
    city : String,
    password : String
});

module.exports = mongoose.model('userdb', userSchema);