const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');

router.post('/', async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      place: req.body.place,
      message: req.body.message
    });

    await contact.save();
    res.status(201).json({ message: 'Contact saved successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
