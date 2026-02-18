const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['consumer', 'shop_owner', 'admin'], 
    default: 'consumer' 
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Price'
  }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;