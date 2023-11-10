// controllers/api/post-routes.js:
const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPostData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.session.userId // Changed from user_id to userId
  };
      console.log("Creating new post with data:", newPostData); // Corrected line
      const newPost = await Post.create(newPostData);
      res.status(200).json(newPost);
  } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json(err);
  }
});
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }, {
        model: Comment,
        as: 'comments',
        include: {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      }]
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json(err);
  }
});

module.exports = router;
