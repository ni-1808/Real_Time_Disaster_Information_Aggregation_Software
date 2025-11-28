const express = require('express');
const DisasterPrediction = require('../models/DisasterPrediction');
const DroneData = require('../models/DroneData');
const blockchainVerification = require('../services/blockchainVerification');
const sentimentAnalysis = require('../services/sentimentAnalysis');
const quantumEncryption = require('../services/quantumEncryption');

const router = express.Router();

// AI Disaster Prediction
router.post('/predict', async (req, res) => {
  try {
    const { location, historicalData, weatherPatterns } = req.body;
    
    // Simulate AI prediction
    const prediction = new DisasterPrediction({
      location,
      disasterType: 'flood',
      probability: Math.floor(Math.random() * 100),
      predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      factors: ['Heavy rainfall predicted', 'River levels rising', 'Historical flood zone'],
      confidence: 'high',
      aiModel: 'DeepDisaster-v2.1'
    });
    
    await prediction.save();
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Blockchain Verification
router.post('/blockchain/verify', async (req, res) => {
  try {
    const { reportId, type, location, verifiedBy, imageHashes } = req.body;
    
    const block = blockchainVerification.addDisasterBlock({
      reportId, type, location, verifiedBy, imageHashes
    });
    
    res.json({ 
      message: 'Report added to blockchain',
      blockHash: block.hash,
      blockIndex: block.index,
      chainValid: blockchainVerification.verifyChain()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Drone Surveillance
router.get('/drones', async (req, res) => {
  try {
    const drones = await DroneData.find({ status: 'active' });
    res.json(drones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Social Media Analysis
router.post('/analyze-social', async (req, res) => {
  try {
    const { text, location, hashtags } = req.body;
    
    const analysis = sentimentAnalysis.analyzeSocialPost(text, location);
    const processedHashtags = sentimentAnalysis.processHashtags(hashtags || []);
    
    res.json({
      analysis,
      emergencyHashtags: processedHashtags,
      recommendation: analysis.urgencyLevel > 50 ? 'Create alert' : 'Monitor'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quantum Encrypted Communication
router.post('/quantum/encrypt', async (req, res) => {
  try {
    const { message, recipientId } = req.body;
    
    const encrypted = quantumEncryption.encryptEmergencyMessage(message, recipientId);
    res.json(encrypted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;