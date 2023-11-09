// controllers/dashboard-routes.js:
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Post } = require('../models');  // Add this line to require the Post model

// Dashboard route
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      }
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('dashboard', { 
      layout: 'main', // Specify the layout you are using
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



