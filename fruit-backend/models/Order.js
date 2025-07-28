// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     customerName: { type: String, required: true },
//     email: { type: String, required: true },
//     cartItems: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//             quantity: { type: Number, required: true }
//         }
//     ],
//     totalAmount: { type: Number, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  paymentMethod: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
