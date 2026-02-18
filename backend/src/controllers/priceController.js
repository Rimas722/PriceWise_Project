const Price = require('../models/Price');
require('../models/Product'); 
require('../models/Shop');

const getPrices = async (req, res) => {
  try {
    const prices = await Price.find({ status: 'approved' })
      .populate('product', 'name unit category image')
      .populate('shop', 'shopName')
      .populate('submittedBy', 'name email');

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPrice = async (req, res) => {
  const { product, shop, price } = req.body;

  try {
    const newPrice = new Price({
      product,
      shop,
      price,
      submittedBy: req.user._id, 
      status: 'pending' 
    });

    const createdPrice = await newPrice.save();
    res.status(201).json(createdPrice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyPrices = async (req, res) => {
  try {
    const prices = await Price.find({ submittedBy: req.user._id })
      .populate('product', 'name unit')
      .populate('shop', 'shopName');
      
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }

    if (price.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this price' });
    }

    await price.deleteOne(); 
    res.json({ message: 'Price removed' });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const approvePrice = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    if (price) {
      price.status = 'approved';
      const updatedPrice = await price.save();
      res.json(updatedPrice);
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPricesAdmin = async (req, res) => {
  try {
    const prices = await Price.find({}) 
      .populate('product', 'name unit category image ')
      .populate('shop', 'shopName')
      .populate('submittedBy', 'name email');
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPriceAnalytics = async (req, res) => {
  try {
    const data = await Price.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.name', 
          averagePrice: { $avg: '$price' }, 
          minPrice: { $min: '$price' }, 
          maxPrice: { $max: '$price' } 
        }
      }
    ]);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPrices, createPrice, getMyPrices, deletePrice, approvePrice, getAllPricesAdmin, getPriceAnalytics };