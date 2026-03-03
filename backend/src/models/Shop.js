const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  shopName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', 
  },
  latitude: { 
    type: Number 
  },
  longitude: { 
    type: Number 
  },
}, {
  timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;