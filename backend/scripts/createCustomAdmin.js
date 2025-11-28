const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const createCustomAdmin = async () => {
  const name = process.argv[2] || 'Admin User';
  const email = process.argv[3] || 'admin@example.com';
  const password = process.argv[4] || 'admin123';

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with this email');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log(`Admin created: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createCustomAdmin();