const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  icon: {
    type: String, 
    default: '📦'
  },
  subCategories: [{ 
    type: String 
  }]
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;