const express = require('express');
const router = express.Router();
const { getPrices, createPrice, getMyPrices, deletePrice } = require('../controllers/priceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPrices); 
router.post('/', protect, createPrice);
router.get('/my-prices', protect, getMyPrices); 
router.delete('/:id', protect, deletePrice); 

module.exports = router;