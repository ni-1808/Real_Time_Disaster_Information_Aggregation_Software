const mongoose = require('mongoose');
const UserReport = require('../models/UserReport');
const User = require('../models/User');
const mlClassifier = require('../services/mlClassifier');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const createTestReport = async () => {
  try {
    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'user'
    });
    await testUser.save();

    // Create test report
    const testReport = new UserReport({
      userId: testUser._id,
      type: 'earthquake',
      location: {
        type: 'Point',
        coordinates: [77.1025, 28.7041],
        address: 'Delhi, India'
      },
      description: 'Major earthquake felt in Delhi area. Buildings shaking, people evacuating. Need immediate help and rescue teams.',
      hashtags: ['earthquake', 'emergency', 'help'],
      severity: 'high',
      images: []
    });

    // Run ML classification
    const classification = mlClassifier.classifyReport({
      description: testReport.description,
      images: testReport.images,
      location: testReport.location,
      userId: testReport.userId
    });

    testReport.mlClassification = classification;
    await testReport.save();

    console.log('Test report created with ML analysis:');
    console.log('Report ID:', testReport._id);
    console.log('ML Classification:', classification);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestReport();