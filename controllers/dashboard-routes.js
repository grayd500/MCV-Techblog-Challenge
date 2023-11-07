// controllers/dashboard-routes.js:
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  res.send('Dashboard Page');
});

module.exports = router;

