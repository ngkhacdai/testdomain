const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    sex: {
        type: String,
    },
    role: {
        type: String
    }
})

module.exports = new mongoose.model('user', userSchema);