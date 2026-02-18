const express = require('express');
const router = express.Router();
const { 
  getShops, 
  getAllShopsAdmin, 
  createShop, 
  approveShop, 
  getShopById, 
  updateShop, 
  deleteShop,
  getMyShop,   
  updateMyShop 
} = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getShops); 
router.get('/all', protect, admin, getAllShopsAdmin);
router.post('/', protect, createShop);

router.get('/myshop', protect, getMyShop);    
router.put('/myshop', protect, updateMyShop);  

router.get('/:id', getShopById);        
router.put('/:id', protect, admin, updateShop);
router.delete('/:id', protect, admin, deleteShop);
router.put('/:id/approve', protect, admin, approveShop);

module.exports = router;