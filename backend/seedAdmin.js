const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (adminExists) {
            console.log('ℹ️ Admin user already exists:', adminExists.email);
            process.exit();
        }

        const admin = await User.create({
            name: 'FoodGenie Master Admin',
            email: 'admin@foodgenie.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('🚀 Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        process.exit();
    } catch (err) {
        console.error('❌ Failed to seed admin:', err);
        process.exit(1);
    }
};

seedAdmin();
