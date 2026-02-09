const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point',
    },
    coordinates: {
      type: [Number], 
      required: true,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;