const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    img: {
        contentType: String,
        data: String,
    },
    quantyti: {
        type: Number,
    },
    descaption: {
        type: String
    },
})

module.exports = new mongoose.model('product', productSchema)