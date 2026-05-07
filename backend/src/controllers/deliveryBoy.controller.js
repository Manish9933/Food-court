const DeliveryBoy = require('../models/DeliveryBoy');

// @desc    Get all delivery boys
// @route   GET /api/delivery-boys
exports.getDeliveryBoys = async (req, res) => {
  try {
    const boys = await DeliveryBoy.find({});
    res.json(boys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a delivery boy
// @route   POST /api/delivery-boys
exports.createDeliveryBoy = async (req, res) => {
  try {
    const { name, phone, email, vehicleNumber } = req.body;
    const boy = await DeliveryBoy.create({ name, phone, email, vehicleNumber });
    res.status(201).json(boy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update delivery boy status
exports.updateBoyStatus = async (req, res) => {
  try {
    const boy = await DeliveryBoy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (boy) {
      res.json(boy);
    } else {
      res.status(404).json({ message: 'Delivery Boy not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a delivery boy
exports.deleteDeliveryBoy = async (req, res) => {
    try {
        const boy = await DeliveryBoy.findByIdAndDelete(req.params.id);
        if (boy) {
            res.json({ message: 'Agent removed from fleet.' });
        } else {
            res.status(404).json({ message: 'Agent not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
