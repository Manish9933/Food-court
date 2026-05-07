const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  vehicleNumber: { type: String },
  status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
  activeOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  completedOrdersCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);
