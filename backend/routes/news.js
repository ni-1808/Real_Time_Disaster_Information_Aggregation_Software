const express = require('express');
const News = require('../models/News');

const router = express.Router();

// Get disaster news
router.get('/', async (req, res) => {
  try {
    const { category, region, severity, limit = 20 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (region) filter.region = region;
    if (severity) filter.severity = severity;
    
    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;