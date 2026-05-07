const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, deleteOrder, createOrder, getMyOrders, getOrderById, addReview, assignCourier, getPublicReviews } = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/public-reviews', getPublicReviews);
router.get('/', protect, admin, getOrders);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/review', protect, addReview);
router.put('/:id', protect, admin, updateOrderStatus);
router.put('/:id/assign', protect, admin, assignCourier);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;

