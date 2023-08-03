const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    order_id: {
        type: String,
    },
    product_id: {
        type: String,
    },
    quantyti: {
        type: Number,
    }
})

module.exports = new mongoose.model('orderitem', orderItemSchema);