const express = require('express');
const UserReport = require('../models/UserReport');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's location-based notifications
router.get('/my', auth, async (req, res) => {
  try {
    // Find user's reports to get their active locations
    const userReports = await UserReport.find({ userId: req.user.userId });
    
    // Get coordinates of user's reported locations
    const userLocations = userReports.map(report => report.location.coordinates);
    
    res.json({
      activeLocations: userLocations.length,
      reportedAreas: userReports.map(report => ({
        type: report.type,
        location: report.location.address,
        date: report.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/read/:notificationId', auth, async (req, res) => {
  try {
    // In a real app, you'd have a notifications collection
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;