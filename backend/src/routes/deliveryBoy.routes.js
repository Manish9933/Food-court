const express = require('express');
const router = express.Router();
const { getDeliveryBoys, createDeliveryBoy, updateBoyStatus, deleteDeliveryBoy } = require('../controllers/deliveryBoy.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/', protect, admin, getDeliveryBoys);
router.post('/', protect, admin, createDeliveryBoy);
router.put('/:id', protect, admin, updateBoyStatus);
router.delete('/:id', protect, admin, deleteDeliveryBoy);

module.exports = router;
