const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  price: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Price',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  proofImage: {
    type: String,
    default: '' 
  }
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;