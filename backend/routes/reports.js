const express = require('express');
const multer = require('multer');
const UserReport = require('../models/UserReport');
const auth = require('../middleware/auth');
const mlClassifier = require('../services/mlClassifier');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Submit disaster report
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { type, location, description, hashtags, severity } = req.body;
    
    const report = new UserReport({
      userId: req.user.userId,
      type,
      location: JSON.parse(location),
      description,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
      images: req.files ? req.files.map(file => file.filename) : [],
      severity
    });
    
    await report.save();
    
    // Run ML classification
    const classification = mlClassifier.classifyReport({
      description: report.description,
      images: report.images,
      location: report.location,
      userId: report.userId
    });
    
    // Update report with ML results
    report.mlClassification = classification;
    await report.save();
    
    console.log('ML Classification Result:', classification);
    
    res.status(201).json({ 
      message: 'Report submitted and analyzed',
      report, 
      classification 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reports
router.get('/my', auth, async (req, res) => {
  try {
    const reports = await UserReport.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all verified reports with ML analysis
router.get('/verified', async (req, res) => {
  try {
    const reports = await UserReport.find({ verified: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reports (public access)
router.get('/all', async (req, res) => {
  try {
    const reports = await UserReport.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;