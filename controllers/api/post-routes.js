// controllers/api/post-routes.js:
const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Route to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    // Preparing new post data using request body and session information
    const newPostData = {
      title: req.body.title,
      content: req.body.content,
      userId: req.session.userId 
    };
    console.log("Creating new post with data:", newPostData);

    // Creating a new post in the database
    const newPost = await Post.create(newPostData);

    // Sending the created post as a response
    res.status(200).json(newPost);
  } catch (err) {
    // Logging and sending an error response if something goes wrong
    console.error('Error creating post:', err);
    res.status(500).json(err);
  }
});

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    // Retrieving all posts from the database including associated User and Comment data
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

    // Sending all posts as a response
    res.status(200).json(posts);
  } catch (err) {
    // Logging and sending an error response if something goes wrong
    console.error('Error fetching posts:', err);
    res.status(500).json(err);
  }
});

// Route to update a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    // Updating post data in the database for the given post ID
    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.userId
      }
    });

    // Checking if the post was updated, send error message if not found
    if (!postData[0]) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    // Sending the updated post data as a response
    res.status(200).json(postData);
  } catch (err) {
    // Logging and sending an error response if something goes wrong
    console.error('Error updating post:', err);
    res.status(500).json(err);
  }
});

// Route to delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // Deleting a post from the database based on the given ID
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId
      }
    });

    // Checking if the post was deleted, send error message if not found
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    // Sending a success response
    res.status(200).json(postData);
  } catch (err) {
    // Logging and sending an error response if something goes wrong
    console.error('Error deleting post:', err);
    res.status(500).json(err);
  }
});

// Exporting the router to be used in other parts of the application
module.exports = router;
