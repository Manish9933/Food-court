const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Get public reviews for testimonials
// @route   GET /api/orders/public-reviews
exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Order.find({ 'ratings.restaurant': { $exists: true } })
      .sort({ 'ratings.restaurant': -1, updatedAt: -1 })
      .limit(6)
      .populate('user', 'name');
    
    const formattedReviews = reviews.map(order => ({
      name: order.user?.name || 'Happy Customer',
      role: 'Verified Buyer',
      text: order.ratings.feedback || 'Excellent service and delicious food!',
      avatar: `https://i.pravatar.cc/150?u=${order._id}`,
      rating: order.ratings.restaurant
    }));

    res.json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentStatus, shippingAddress } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const customId = 'GENIE-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      customId,
      paymentStatus: paymentStatus || 'Unpaid'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.foodItem', 'name price');

    // Create Notification
    await Notification.create({
      type: 'order',
      message: `New Order Received: #${customId} from ${populatedOrder.user?.name || 'Guest'} - $${totalAmount.toFixed(2)}`
    });

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('deliveryBoy', 'name phone')
      .populate('items.foodItem', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign courier to order
// @route   PUT /api/orders/:id/assign
exports.assignCourier = async (req, res) => {
  try {
    const { courierId } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        deliveryBoy: courierId,
        status: 'Out for Delivery'
      },
      { new: true }
    ).populate('deliveryBoy', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create Notification
    await Notification.create({
      type: 'order',
      message: `Courier Deployed: #${order.customId || order._id} assigned to ${order.deliveryBoy?.name || 'Agent'}`
    });
    
    res.json(order);
  } catch (error) {
    console.error('Assignment Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('deliveryBoy', 'name phone')
      .populate('items.foodItem', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('deliveryBoy', 'name phone')
    .populate('items.foodItem', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create Notification on status change
    await Notification.create({
      type: 'order',
      message: `Status Update: #${order.customId || order._id} is now ${status}`
    });
    
    res.json(order);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('deliveryBoy', 'name phone')
      .populate('items.foodItem', 'name price');
    
    if (order) {
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review to order
// @route   POST /api/orders/:id/review
exports.addReview = async (req, res) => {
  try {
    const { restaurant, delivery, feedback } = req.body;
    
    // Check ownership
    const orderCheck = await Order.findById(req.params.id);
    if (!orderCheck) return res.status(404).json({ message: 'Order not found' });
    if (orderCheck.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        ratings: {
          restaurant: Number(restaurant),
          delivery: Number(delivery),
          feedback
        }
      },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    console.error('Review Error:', error);
    res.status(400).json({ message: error.message });
  }
};
