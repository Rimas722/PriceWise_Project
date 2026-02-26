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
  const { product, shop, price, proofImage } = req.body;

  try {
    const newPrice = new Price({
      product,
      shop,
      price,
      proofImage: proofImage || '', 
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
    const pendingPrice = await Price.findById(req.params.id);

    if (!pendingPrice) {
      return res.status(404).json({ message: 'Pending price not found' });
    }

    const existingPrice = await Price.findOne({
      product: pendingPrice.product,
      shop: pendingPrice.shop,
      status: 'approved'
    });

    if (existingPrice) {
      existingPrice.price = pendingPrice.price;

      if (pendingPrice.proofImage) {
        existingPrice.proofImage = pendingPrice.proofImage; 
      }

      await existingPrice.save();

      await pendingPrice.deleteOne(); 

      res.json({ message: 'Existing price updated successfully!', price: existingPrice });
    } else {
      pendingPrice.status = 'approved';
      await pendingPrice.save();

      res.json({ message: 'New price approved successfully!', price: pendingPrice });
    }
  } catch (error) {
    console.error("🚨 Error approving price:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllPricesAdmin = async (req, res) => {
  try {
    const prices = await Price.find({}) 
      .populate('product', 'name image category')
      .populate('shop', 'shopName address')
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