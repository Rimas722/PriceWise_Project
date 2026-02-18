const Shop = require('../models/Shop');
const Price = require('../models/Price');

const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ status: 'approved' });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllShopsAdmin = async (req, res) => {
  try {
    const shops = await Shop.find({}).populate('owner', 'name email');
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createShop = async (req, res) => {
  const { shopName, address, phoneNumber } = req.body;

  try {
    const shop = new Shop({
      owner: req.user._id,
      shopName,
      address,
      phoneNumber,
      status: 'pending'
    });

    const createdShop = await shop.save();
    res.status(201).json(createdShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop) {
      shop.status = 'approved';
      const updatedShop = await shop.save();
      res.json(updatedShop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const prices = await Price.find({ shop: req.params.id }).populate('product');
    res.json({ shop, prices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateShop = async (req, res) => {
  const { shopName, address } = req.body;
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop) {
      shop.shopName = shopName || shop.shopName;
      shop.address = address || shop.address;
      const updatedShop = await shop.save();
      res.json(updatedShop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (shop) {
      const Price = require('../models/Price'); 
      await Price.deleteMany({ shop: req.params.id });
      
      await shop.deleteOne();
      res.json({ message: 'Shop and its prices removed' });
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    
    if (shop) {
      res.json(shop);
    } else {
      res.status(404).json({ message: 'No shop found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyShop = async (req, res) => {
  const { shopName, address, phoneNumber } = req.body;

  try {
    const shop = await Shop.findOne({ owner: req.user._id });

    if (shop) {
      shop.shopName = shopName || shop.shopName;
      shop.address = address || shop.address;
      shop.phoneNumber = phoneNumber || shop.phoneNumber;
      
      const updatedShop = await shop.save();
      res.json(updatedShop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShops, getAllShopsAdmin, createShop, approveShop, getShopById, updateShop, deleteShop, getMyShop, updateMyShop };