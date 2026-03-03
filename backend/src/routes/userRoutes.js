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
  resetPassword,
  getUsers,
  deleteUser 
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/verify/:token', verifyEmail);
router.post('/', registerUser);

router.post('/login', loginUser || authUser); 

router.get('/favorites', protect, getFavorites);     
router.post('/favorites', protect, toggleFavorite);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;