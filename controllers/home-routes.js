// controllers/home-routes.js:
const router = require('express').Router();
const { User } = require('../models'); // Ensure this path is correct
const { check, validationResult } = require('express-validator');

// Existing dummy route for home
router.get('/', (req, res) => {
  res.render('all-posts'); // Make sure 'all-posts' corresponds with your Handlebars template for the homepage
});

// Add the login view route
router.get('/login', (req, res) => {
    res.render('login'); // Assumes there is a login.handlebars file in your views directory
  });

// Add the register view route
router.get('/register', (req, res) => {
    res.render('register'); // Assumes there is a register.handlebars file in your views directory
  });

// Register route with validation middleware
router.post('/register', 
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', { errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      await User.create({ username, email, password: hashedPassword });
      res.redirect('/login');
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).render('register', { error: 'Internal Server Error' });
    }
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.loggedIn = true;
      req.session.userId = user.id;
      res.redirect('/'); // Redirect to homepage or dashboard after login
    } else {
      res.status(401).render('login', { error: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { error: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login'); // Redirect to login after logout
    });
  }
});

module.exports = router;
