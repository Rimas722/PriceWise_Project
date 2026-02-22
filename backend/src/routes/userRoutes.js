const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  authUser, 
  toggleFavorite, 
  getFavorites 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);

router.post('/login', loginUser || authUser); 

router.get('/favorites', protect, getFavorites);     
router.post('/favorites', protect, toggleFavorite); 

module.exports = router;