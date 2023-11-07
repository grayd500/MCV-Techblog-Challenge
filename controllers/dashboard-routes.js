const router = require('express').Router();

// Dummy route
router.get('/', (req, res) => {
  res.send('Dashboard Page');
});

module.exports = router;

