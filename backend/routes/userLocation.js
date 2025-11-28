const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user location
router.put('/location', auth, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    
    await User.findByIdAndUpdate(req.user.userId, {
      location: { lat, lng, address }
    });
    
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;