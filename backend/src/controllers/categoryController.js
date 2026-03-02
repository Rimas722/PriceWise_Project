const Category = require('../models/Category');

const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = new Category({ name, icon });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Category already exists' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.subCategories.includes(req.body.subCategory)) {
      return res.status(400).json({ message: 'Sub-category already exists in this category' });
    }

    category.subCategories.push(req.body.subCategory);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createCategory, getCategories, deleteCategory, addSubCategory };