const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || !total) {
      return res.status(400).json({ message: 'Missing items or total' });
    }

    const cart = new Cart({ items, total });
    await cart.save();

    res.json({ message: 'Order placed', cartId: cart._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
