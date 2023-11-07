// controllers/dashboard-routes.js:
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  res.render('dashboard', {
    onDashboard: true
  });
});

module.exports = router;



