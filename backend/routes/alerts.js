const express = require('express');
const Alert = require('../models/Alert');

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const { type, severity, limit = 50 } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    
    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get alerts by location
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 100 } = req.query;
    
    const alerts = await Alert.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).limit(20);
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;