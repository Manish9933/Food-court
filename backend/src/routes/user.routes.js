const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
