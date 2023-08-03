const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
    }
})

module.exports = new mongoose.model('cart', cartSchema);