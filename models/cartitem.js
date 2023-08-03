const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart_id: {
        type: String,
    },
    product_id: {
        type: String,
    },
    quantyti: {
        type: Number,
    }
})

module.exports = new mongoose.model('cartitem', cartItemSchema);