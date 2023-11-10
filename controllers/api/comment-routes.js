// controllers/api/comment-routes.js:
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      text: req.body.text,     // This should match the key from the client-side
      postId: req.body.postId, // This too
      userId: req.session.userId  // This grabs the userId from the session
    });
    res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;

