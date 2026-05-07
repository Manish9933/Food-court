require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.set('etag', false);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/menu', require('./src/routes/menu.routes.js'));
app.use('/api/food', require('./src/routes/menu.routes.js')); // Alias as per requirement
app.use('/api/auth', require('./src/routes/auth.routes.js'));
app.use('/api/orders', require('./src/routes/order.routes.js'));
app.use('/api/users', require('./src/routes/user.routes.js'));
app.use('/api/categories', require('./src/routes/category.routes.js'));
app.use('/api/notifications', require('./src/routes/notification.routes.js'));
app.use('/api/chat', require('./src/routes/chat.js'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes.js'));
app.use('/api/delivery-boys', require('./src/routes/deliveryBoy.routes.js'));


app.get('/', (req, res) => {
  res.json({ message: "Welcome to FoodGenie AI Backend API!" });
});

// Health Check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
