const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@disaster.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created: admin@disaster.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();