// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { check, validationResult } = require('express-validator'); // Import express-validator

const router = express.Router();

// Render the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Render the registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register route with validation middleware
router.post('/register', 
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const { username, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the 'register' page with errors
      return res.status(400).render('register', { errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 8);

      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.redirect('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Server error, render 'register' with an error message
      res.status(500).render('register', { error: 'Internal Server Error' });
    }
  });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.loggedIn = true;
      req.session.userId = user.id;

      res.redirect('/'); // Redirect to homepage or dashboard after login
    } else {
      // Invalid credentials, render login with error
      res.status(401).render('login', { error: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    // Server error, render login with error
    res.status(500).render('login', { error: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Redirect to login after logout
  });
});

module.exports = router;