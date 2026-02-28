const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  verifyEmail,
  loginUser, 
  authUser, 
  toggleFavorite, 
  getFavorites,
  forgotPassword,
  resetPassword 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.get('/verify/:token', verifyEmail);
router.post('/', registerUser);

router.post('/login', loginUser || authUser); 

router.get('/favorites', protect, getFavorites);     
router.post('/favorites', protect, toggleFavorite);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;