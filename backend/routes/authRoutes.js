const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public routes
router.post('/signup',  authController.signup);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);

// Admin only routes
router.get('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const users = await User.getAll(parseInt(limit), offset);
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;