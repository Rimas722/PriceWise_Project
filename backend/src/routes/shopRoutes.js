const express = require('express');
const router = express.Router();
const { getShops } = require('../controllers/shopController');

router.get('/', getShops);

module.exports = router;