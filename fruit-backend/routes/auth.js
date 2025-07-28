// const express = require('express');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const client = new OAuth2Client('924469195964-slq5ukhc042omhnvkd6gqoiedddkv7jv.apps.googleusercontent.com');

// Google Sign-In (Step 1)
router.post('/google', async (req, res) => {
  const { token, password } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '924469195964-slq5ukhc042omhnvkd6gqoiedddkv7jv.apps.googleusercontent.com'
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // First-time Google sign-up, require password
      if (!password)
        return res.status(400).json({ message: 'Password required for first-time Google signup' });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword, provider: 'google' });
      await user.save();
    }

    res.status(200).json({ message: 'Google login/signup successful', user });

  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
});

//google-sign-in
router.post('/google-signin', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '924469195964-slq5ukhc042omhnvkd6gqoiedddkv7jv.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, auto-register them
      user = new User({
        name,
        email,
        password: '', // No password for Google users
        provider: 'google'
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Google Sign-In failed' });
  }
});

// signup
router.post('/signup', async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone, // ✅ Save phone
      email,
      password: hashedPassword,
    });
    if (!name || !phone || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// module.exports = router;

//login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  res.status(200).json({ message: 'Login successful', user });
});

module.exports = router;
