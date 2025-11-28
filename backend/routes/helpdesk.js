const express = require('express');
const Helpdesk = require('../models/Helpdesk');

const router = express.Router();

// Get helpdesk contacts
router.get('/', async (req, res) => {
  try {
    const { state } = req.query;
    const filter = state ? { state } : {};
    
    const contacts = await Helpdesk.find(filter);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;