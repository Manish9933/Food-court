const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isPlateComponent: { type: Boolean, default: false },
  plateCategory: { type: String, default: 'none' }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
