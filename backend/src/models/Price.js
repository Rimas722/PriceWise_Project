const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  proofImage: {
    type: String, default: ""
  },
  submittedBy: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User' 
    },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending',
  },
  helpfulVotes: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
}, {
  timestamps: true, 
});

const Price = mongoose.model('Price', priceSchema);
module.exports = Price;