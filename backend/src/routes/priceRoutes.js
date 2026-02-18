const express = require('express');
const router = express.Router();
const { getPrices, createPrice, getMyPrices, deletePrice, approvePrice, getAllPricesAdmin, getPriceAnalytics } = require('../controllers/priceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPrices); 
router.post('/', protect, createPrice);
router.get('/my-prices', protect, getMyPrices); 
router.get('/all', protect, admin, getAllPricesAdmin);
router.get('/analytics', getPriceAnalytics); 
router.delete('/:id', protect, deletePrice); 
router.put('/:id/approve', protect, admin, approvePrice);


module.exports = router;