const express = require('express');
const router = express.Router();
const { registerUser, loginUser, toggleFavorite, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);

router.put('/favorites/:id', protect, toggleFavorite); 
router.get('/favorites', protect, getFavorites);      

module.exports = router;