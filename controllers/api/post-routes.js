// controllers/api/post-routes.js:
const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
      const newPostData = {
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
      };
      const newPost = await Post.create(newPostData);
      res.status(200).json(newPost);
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json(err);
    }
  });

module.exports = router;
