// controllers/dashboard-routes.js:
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Post } = require('../models');  // Add this line to require the Post model

// Dashboard route
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId // Change from user_id to userId to match the login route
      }
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log('Dashboard posts:', posts); // This will output the posts data to your console
    res.render('dashboard', {
      layout: 'main',
      posts,
      onDashboard: true,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;


module.exports = router;



