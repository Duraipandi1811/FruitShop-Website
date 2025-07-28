const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'Hello'; // ⚠️ Move to process.env.SECRET in real deployment

// ✅ Admin Registration (done once, optionally protected)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hash, isAdmin: true }); // ✅ Mark as admin
  await admin.save();

  res.json({ message: '✅ Admin created successfully' });
});

// ✅ Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !admin.isAdmin) {
    return res.status(403).json({ message: 'Access denied: not an admin' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: admin._id, isAdmin: true }, SECRET, { expiresIn: '2h' });
  res.json({ token, message: '✅ Logged in successfully' });
});

// ✅ Middleware to verify admin access
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Not an admin' });

    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { router, verifyAdminToken };
