const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, clearNotifications } = require('../controllers/notification.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/', protect, admin, getNotifications);
router.put('/:id', protect, admin, markAsRead);
router.delete('/', protect, admin, clearNotifications);

module.exports = router;
