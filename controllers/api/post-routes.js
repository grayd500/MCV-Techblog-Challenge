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
// Update a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.userId // Ensure only the creator can update the post
      }
    });

    if (!postData[0]) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json(err);
  }
});

// Delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId // Ensure only the creator can delete the post
      }
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json(err);
  }
});

module.exports = router;
