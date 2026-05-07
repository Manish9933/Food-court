const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const activeUsers = await User.countDocuments({ role: 'user' });
    const totalFoodItems = await FoodItem.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('items.foodItem', 'name');

    // Revenue by month (last 6 months)
    const revenueByMonth = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      activeUsers,
      totalFoodItems,
      totalCategories,
      recentOrders,
      revenueByMonth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
