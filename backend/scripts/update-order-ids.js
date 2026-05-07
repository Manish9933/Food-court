require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

const updateOrderIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const orders = await Order.find({ customId: { $exists: false } });
    console.log(`Found ${orders.length} orders without customId`);

    for (const order of orders) {
      if (!order.customId) {
        order.customId = 'GENIE-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        await order.save();
        console.log(`Updated Order ${order._id} with ID ${order.customId}`);
      }
    }

    console.log('Update complete');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

updateOrderIds();
