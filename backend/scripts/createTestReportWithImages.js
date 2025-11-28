const mongoose = require('mongoose');
const UserReport = require('../models/UserReport');
const User = require('../models/User');
const mlClassifier = require('../services/mlClassifier');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const createTestReports = async () => {
  try {
    // Create test user if not exists
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Reporter',
        email: 'testuser@example.com',
        password: 'test123',
        role: 'user'
      });
      await testUser.save();
    }

    // Create multiple test reports
    const testReports = [
      {
        userId: testUser._id,
        type: 'earthquake',
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041],
          address: 'Delhi, India'
        },
        description: 'Major earthquake felt in Delhi area. Buildings shaking, people evacuating. Need immediate help and rescue teams.',
        hashtags: ['earthquake', 'emergency', 'help', 'delhi'],
        severity: 'high',
        images: ['sample1.jpg', 'sample2.jpg'], // Simulated image names
        verified: true
      },
      {
        userId: testUser._id,
        type: 'flood',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760],
          address: 'Mumbai, India'
        },
        description: 'Heavy rainfall causing severe flooding in Mumbai streets. Water level rising rapidly.',
        hashtags: ['flood', 'mumbai', 'rain', 'emergency'],
        severity: 'critical',
        images: ['flood1.jpg'],
        verified: true
      },
      {
        userId: testUser._id,
        type: 'fire',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bangalore, India'
        },
        description: 'Forest fire spreading near Bangalore outskirts. Smoke visible from city.',
        hashtags: ['fire', 'bangalore', 'forest'],
        severity: 'medium',
        images: [],
        verified: true
      }
    ];

    for (const reportData of testReports) {
      // Run ML classification
      const classification = mlClassifier.classifyReport({
        description: reportData.description,
        images: reportData.images,
        location: reportData.location,
        userId: reportData.userId
      });

      const report = new UserReport({
        ...reportData,
        mlClassification: classification
      });

      await report.save();
      console.log(`Created report: ${report.type} in ${report.location.address}`);
      console.log(`ML Analysis: ${classification.isAuthentic ? 'Authentic' : 'Suspicious'} (${classification.confidence}%)`);
    }

    console.log('Test reports created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestReports();