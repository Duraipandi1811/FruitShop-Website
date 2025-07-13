const Order = require('../models/Order');

// GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('cartItems.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('cartItems.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/orders
exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
        const saved = await order.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
