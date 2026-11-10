const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./src/models/User');

const email = process.argv[2] || 'kangra460@gmail.com';
const rawPassword = process.argv[3] || 'admin123';

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email });
    if (user) {
      user.role = 'admin';
      user.password = rawPassword; // will be hashed by pre-save
      await user.save();
      console.log(`Updated existing user ${email} to admin with password: ${rawPassword}`);
    } else {
      user = await User.create({
        name: 'Manish Kangra',
        email: email,
        password: rawPassword,
        role: 'admin'
      });
      console.log(`Created new admin user ${email} with password: ${rawPassword}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error setting admin:', err.message);
    process.exit(1);
  }
}

setAdmin();

