const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Rice', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Spices', 'Other'], 
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'packet', 'item'],
  },
  image: {
    type: String, 
    default: 'https://placehold.co/150', 
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;