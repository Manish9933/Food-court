const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/stats', protect, admin, getStats);

module.exports = router;
