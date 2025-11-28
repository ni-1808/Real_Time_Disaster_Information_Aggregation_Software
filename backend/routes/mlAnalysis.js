const express = require('express');
const UserReport = require('../models/UserReport');
const mlClassifier = require('../services/mlClassifier');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Analyze specific report
router.post('/analyze/:reportId', adminAuth, async (req, res) => {
  try {
    const report = await UserReport.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const classification = mlClassifier.classifyReport({
      description: report.description,
      images: report.images,
      location: report.location,
      userId: report.userId
    });

    report.mlClassification = classification;
    await report.save();

    res.json({ report, classification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ML statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalReports = await UserReport.countDocuments();
    const authenticReports = await UserReport.countDocuments({ 'mlClassification.isAuthentic': true });
    const suspiciousReports = await UserReport.countDocuments({ 'mlClassification.isAuthentic': false });
    const unanalyzed = await UserReport.countDocuments({ mlClassification: { $exists: false } });

    res.json({
      totalReports,
      authenticReports,
      suspiciousReports,
      unanalyzed,
      accuracyRate: totalReports > 0 ? Math.round((authenticReports / totalReports) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk analyze all reports
router.post('/analyze-all', adminAuth, async (req, res) => {
  try {
    const reports = await UserReport.find({ mlClassification: { $exists: false } });
    let processed = 0;

    for (const report of reports) {
      const classification = mlClassifier.classifyReport({
        description: report.description,
        images: report.images,
        location: report.location,
        userId: report.userId
      });

      report.mlClassification = classification;
      await report.save();
      processed++;
    }

    res.json({ message: `Analyzed ${processed} reports`, processed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;