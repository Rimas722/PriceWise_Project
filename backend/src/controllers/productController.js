const Product = require('../models/Product');
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const createProduct = async (req, res) => {
  const { name, category, unit, image } = req.body;

  try {
    const product = new Product({
      name,
      category,
      unit,
      image: image || 'https://placehold.co/200x200?text=No+Image' 
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct };