//controllers/api/index.js:
const router = require('express').Router();
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes'); // Add this line

router.use('/users', userRoutes);
router.use('/posts', postRoutes); // And this line

module.exports = router;