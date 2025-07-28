const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }, 
  email: { type: String, unique: true },
  password: String, // hashed password (even for Google users)
  provider: { type: String, default: 'local' } // 'local' | 'google' | 'both'
});

module.exports = mongoose.model('User', userSchema);
