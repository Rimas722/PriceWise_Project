const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'consumer',
      isVerified: false,
      verificationToken: verificationToken
    });

    const verifyUrl = `http://localhost:5173/verify/${verificationToken}`;

    const message = `
      Hello ${user.name},\n\n
      Welcome to PriceWise LK! Please verify your email address by clicking the link below:\n\n
      ${verifyUrl}\n\n
      If you did not request this, please ignore this email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'PriceWise LK - Verify Your Email',
      message: message
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email already verified! You can log in.' });
    }

    user.isVerified = true;
    

    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && !user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in. Check your inbox.' });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { priceId } = req.body;

    if (user.favorites.includes(priceId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== priceId);
      await user.save();
      res.json({ message: 'Removed from Watchlist' });
    } else {
      user.favorites.push(priceId);
      await user.save();
      res.json({ message: 'Added to Watchlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'product', select: 'name image category' },
        { path: 'shop', select: 'shopName' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'If this email exists, a reset link has been sent.' }); 
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `Hello ${user.name},\n\nYou requested a password reset for PriceWise LK. Click the link below to set a new password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email. This link will expire in 15 minutes.`;

    await sendEmail({ email: user.email, subject: 'PriceWise LK - Password Reset', message });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, toggleFavorite, getFavorites, verifyEmail, authUser, forgotPassword, resetPassword };