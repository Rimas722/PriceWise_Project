const express = require('express');
const router = express.Router();
const { getPrices, createPrice, getMyPrices, deletePrice, approvePrice, getAllPricesAdmin, getPriceAnalytics, upvotePrice, toggleStockStatus } = require('../controllers/priceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/my-prices', protect, getMyPrices); 
router.get('/all', protect, admin, getAllPricesAdmin);
router.get('/analytics', getPriceAnalytics); 

router.route('/')
  .get(getPrices)
  .post(protect, createPrice);

router.put('/:id/stock', protect, toggleStockStatus); 
router.put('/:id/upvote', protect, upvotePrice);
router.put('/:id/approve', protect, admin, approvePrice);
router.delete('/:id', protect, deletePrice); 

module.exports = router;