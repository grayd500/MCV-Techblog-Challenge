// controllers/home-routes.js:
const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: Comment, include: [User] }]
    });
    const posts = postData.map((post) => {
      let plainPost = post.get({ plain: true });

      // Validate and convert createdAt to Date objects if necessary
      if (plainPost.createdAt) {
        plainPost.createdAt = new Date(plainPost.createdAt);
      } else {
        console.error('Post is missing createdAt date:', plainPost);
        // Set to current date or some placeholder date if missing
        plainPost.createdAt = new Date();
      }

      return plainPost;
    });

    res.render('home', {
      posts,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: Comment, include: [User] }]
    });
    if (postData) {
      const post = postData.get({ plain: true });
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    } else {
      res.status(404).json({ message: 'No post found with this id!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', { errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
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
      res.redirect('/dashboard');
    } else {
      res.status(401).render('login', { error: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { error: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
});

module.exports = router;
