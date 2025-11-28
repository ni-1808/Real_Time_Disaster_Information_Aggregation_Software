const express = require('express');
const Alert = require('../models/Alert');
const UserReport = require('../models/UserReport');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all user reports with ML classification
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reports = await UserReport.find()
      .populate('userId', 'name email credibilityScore')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify user report
router.put('/reports/:id/verify', adminAuth, async (req, res) => {
  try {
    const report = await UserReport.findByIdAndUpdate(
      req.params.id,
      { verified: true, verifiedBy: req.user._id },
      { new: true }
    );
    
    // Create official alert from verified report
    const alert = new Alert({
      type: report.type,
      severity: report.severity,
      location: report.location,
      description: report.description,
      source: 'User Report (Verified)'
    });
    await alert.save();
    
    res.json({ report, alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send location-based alert
router.post('/alerts/send', adminAuth, async (req, res) => {
  try {
    const { type, severity, location, description, radius = 3 } = req.body; // Default 3km
    
    // Create alert
    const alert = new Alert({
      type,
      severity,
      location,
      description,
      source: 'Admin Alert'
    });
    await alert.save();
    
    // Find users within 3km radius based on their location
    const nearbyUsers = await User.find({
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
      role: 'user'
    });
    
    // Filter users within 3km using Haversine formula
    const targetUsers = nearbyUsers.filter(user => {
      const distance = calculateDistance(
        location.coordinates[1], // lat
        location.coordinates[0], // lng
        user.location.lat,
        user.location.lng
      );
      return distance <= radius;
    }).slice(0, 10); // Limit to 10 users
    
    // Send targeted alert
    req.app.get('io').emit('locationAlert', {
      alert,
      message: `🚨 URGENT: ${severity.toUpperCase()} ${type} alert within ${radius}km of your location: ${description}`,
      targetUsers: targetUsers.map(user => user._id.toString()),
      location: location.address,
      coordinates: location.coordinates
    });
    
    res.json({ 
      alert, 
      notifiedUsers: targetUsers.length,
      targetUsers: targetUsers.map(user => ({ 
        name: user.name, 
        email: user.email,
        distance: calculateDistance(
          location.coordinates[1],
          location.coordinates[0], 
          user.location.lat,
          user.location.lng
        ).toFixed(2) + 'km'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send alert to specific location coordinates
router.post('/alerts/location', adminAuth, async (req, res) => {
  try {
    const { coordinates, message, radius = 3 } = req.body;
    
    // Find users within radius
    const nearbyUsers = await User.find({
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
      role: 'user'
    });
    
    const targetUsers = nearbyUsers.filter(user => {
      const distance = calculateDistance(
        coordinates[1], // lat
        coordinates[0], // lng
        user.location.lat,
        user.location.lng
      );
      return distance <= radius;
    }).slice(0, 10);
    
    // Send targeted alert
    req.app.get('io').emit('targetedAlert', {
      message: `🚨 LOCATION ALERT: ${message}`,
      targetUsers: targetUsers.map(user => user._id.toString()),
      coordinates
    });
    
    res.json({ 
      notifiedUsers: targetUsers.length,
      targetUsers: targetUsers.map(user => ({ 
        name: user.name, 
        email: user.email,
        distance: calculateDistance(
          coordinates[1],
          coordinates[0], 
          user.location.lat,
          user.location.lng
        ).toFixed(2) + 'km'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Broadcast to all users
router.post('/broadcast', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get all users
    const allUsers = await User.find({ role: 'user' });
    
    // Send broadcast alert
    req.app.get('io').emit('broadcastAlert', {
      message: `🚨 EMERGENCY BROADCAST: ${message}`,
      timestamp: new Date()
    });
    
    res.json({ 
      message: 'Broadcast sent successfully',
      notifiedUsers: allUsers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user report
router.delete('/reports/:id', adminAuth, async (req, res) => {
  try {
    await UserReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin and regular users)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ role: -1, createdAt: -1 }); // Admins first, then by creation date
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const totalReports = await UserReport.countDocuments();
    const unverifiedReports = await UserReport.countDocuments({ verified: false });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    res.json({
      totalAlerts,
      totalReports,
      unverifiedReports,
      totalUsers,
      totalAdmins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;