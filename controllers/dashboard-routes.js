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
// Route to edit a specific post
router.get('/edit-post/:id', withAuth, async (req, res) => {
  console.log("Edit post route accessed");
  try {
    console.log("Requested Post ID:", req.params.id);
    const postData = await Post.findByPk(req.params.id, {
      raw: true,
      nest: true
    });
    console.log("Post Data:", postData);
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    // Check if the logged-in user is the owner of the post
    if (postData.userId !== req.session.userId) {
      res.status(403).json({ message: 'You do not have permission to edit this post!' });
      return;
    }

    res.render('edit-post', { post: postData, logged_in: req.session.logged_in });
  } catch (err) {
    console.error('Error fetching post for editing:', err);
    res.status(500).json(err);
  }
});
module.exports = router;




