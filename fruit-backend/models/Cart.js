const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      price: Number,
      image: String,
      qty: Number
    }
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);
