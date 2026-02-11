const Price = require('../models/Price');
require('../models/Product'); 
require('../models/Shop');

const getPrices = async (req, res) => {
  try {
    const prices = await Price.find()
      .populate('product', 'name category unit image')
      .populate('shop', 'shopName address')
      .sort({ price: 1 }); 

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPrices };