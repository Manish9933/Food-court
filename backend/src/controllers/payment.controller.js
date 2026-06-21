const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/orders
 */
const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      return res.status(500).json({ 
        message: "Razorpay API keys are not configured. Check your .env file." 
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // convert to smallest currency unit
      currency: currency,
      receipt: `receipt_${crypto.randomBytes(10).toString('hex')}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ 
      message: "Payment Gateway Error", 
      error: error.message 
    });
  }
};

/**
 * @desc    Verify Razorpay Signature
 * @route   POST /api/payments/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment telemetry data" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ 
        success: true,
        message: "Payment verified successfully" 
      });
    } else {
      return res.status(400).json({ 
        success: false,
        message: "Signature mismatch. Possible tampering detected." 
      });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Internal Verification Error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
