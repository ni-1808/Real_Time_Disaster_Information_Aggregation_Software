class MLDisasterClassifier {
  constructor() {
    // Simulated ML model weights and features
    this.features = {
      textAnalysis: 0.3,
      imageAnalysis: 0.4,
      locationConsistency: 0.2,
      userCredibility: 0.1
    };
    
    this.disasterKeywords = [
      'earthquake', 'flood', 'fire', 'storm', 'damage', 'destroyed', 
      'emergency', 'help', 'rescue', 'trapped', 'injured'
    ];
    
    this.fakeIndicators = [
      'fake', 'hoax', 'joke', 'prank', 'test', 'drill', 'exercise'
    ];
  }

  classifyReport(report) {
    const scores = {
      textScore: this.analyzeText(report.description),
      imageScore: this.analyzeImages(report.images),
      locationScore: this.analyzeLocation(report.location),
      userScore: this.analyzeUser(report.userId)
    };

    const finalScore = (
      scores.textScore * this.features.textAnalysis +
      scores.imageScore * this.features.imageAnalysis +
      scores.locationScore * this.features.locationConsistency +
      scores.userScore * this.features.userCredibility
    );

    const classification = {
      isAuthentic: finalScore > 0.6,
      confidence: Math.round(finalScore * 100),
      scores: scores,
      reasoning: this.generateReasoning(scores, finalScore),
      riskLevel: this.calculateRiskLevel(finalScore)
    };

    return classification;
  }

  analyzeText(description) {
    if (!description) return 0.3;
    
    const text = description.toLowerCase();
    let score = 0.5; // Base score
    
    // Check for disaster keywords
    const disasterMatches = this.disasterKeywords.filter(keyword => 
      text.includes(keyword)
    ).length;
    score += disasterMatches * 0.1;
    
    // Check for fake indicators
    const fakeMatches = this.fakeIndicators.filter(indicator => 
      text.includes(indicator)
    ).length;
    score -= fakeMatches * 0.3;
    
    // Length and detail analysis
    if (text.length > 50) score += 0.1;
    if (text.length > 100) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  analyzeImages(images) {
    if (!images || images.length === 0) return 0.4;
    
    let score = 0.6; // Base score for having images
    
    // More images generally indicate authenticity
    if (images.length >= 2) score += 0.2;
    if (images.length >= 3) score += 0.1;
    
    // Simulated image analysis (in real implementation, use computer vision)
    // Check for metadata, resolution, etc.
    score += Math.random() * 0.2; // Simulated image quality score
    
    return Math.min(1, score);
  }

  analyzeLocation(location) {
    if (!location || !location.address) return 0.3;
    
    let score = 0.7; // Base score for having location
    
    // Check if coordinates match address (simplified)
    if (location.coordinates && location.coordinates.length === 2) {
      score += 0.2;
    }
    
    // Check for specific location details
    if (location.address.length > 10) score += 0.1;
    
    return Math.min(1, score);
  }

  analyzeUser(userId) {
    // Simulated user credibility analysis
    // In real implementation, check user history, verification status, etc.
    return 0.5 + Math.random() * 0.3; // Random credibility score
  }

  calculateRiskLevel(score) {
    if (score < 0.3) return 'high_fake_risk';
    if (score < 0.5) return 'medium_risk';
    if (score < 0.7) return 'low_risk';
    return 'authentic';
  }

  generateReasoning(scores, finalScore) {
    const reasons = [];
    
    if (scores.textScore > 0.7) {
      reasons.push('Strong disaster-related content in description');
    } else if (scores.textScore < 0.4) {
      reasons.push('Weak or suspicious text content');
    }
    
    if (scores.imageScore > 0.7) {
      reasons.push('Multiple high-quality images provided');
    } else if (scores.imageScore < 0.4) {
      reasons.push('No images or poor quality images');
    }
    
    if (scores.locationScore > 0.7) {
      reasons.push('Detailed location information provided');
    }
    
    if (finalScore > 0.8) {
      reasons.push('High confidence authentic report');
    } else if (finalScore < 0.4) {
      reasons.push('Multiple indicators suggest potential fake report');
    }
    
    return reasons;
  }
}

module.exports = new MLDisasterClassifier();