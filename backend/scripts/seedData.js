const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const Helpdesk = require('../models/Helpdesk');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    await Alert.deleteMany({});
    await Helpdesk.deleteMany({});

    const alerts = [
      {
        type: 'earthquake',
        severity: 'high',
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041],
          address: 'Delhi, India'
        },
        magnitude: 5.2,
        description: 'Magnitude 5.2 earthquake near Delhi',
        source: 'Sample Data'
      },
      {
        type: 'flood',
        severity: 'critical',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760],
          address: 'Mumbai, India'
        },
        description: 'Heavy rainfall causing severe flooding',
        source: 'Sample Data'
      },
      {
        type: 'cyclone',
        severity: 'high',
        location: {
          type: 'Point',
          coordinates: [80.2707, 13.0827],
          address: 'Chennai, India'
        },
        description: 'Cyclone approaching coastal areas',
        source: 'Sample Data'
      }
    ];

    const helpdesks = [
      { state: 'Delhi', contactNumber: '011-23438091', address: 'Delhi Disaster Management Authority, New Delhi' },
      { state: 'Maharashtra', contactNumber: '022-22027990', address: 'Maharashtra Emergency Management, Mumbai' },
      { state: 'Tamil Nadu', contactNumber: '044-28524085', address: 'Tamil Nadu Disaster Management, Chennai' }
    ];

    await Alert.insertMany(alerts);
    await Helpdesk.insertMany(helpdesks);

    console.log('Sample data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();