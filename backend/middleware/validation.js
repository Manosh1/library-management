const validator = require('validator');

const validateSignup = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check required fields
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long' 
    });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Passwords do not match' 
    });
  }

  // Validate username
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username must be between 3 and 20 characters' 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  next();
};

module.exports = { validateSignup, validateLogin };