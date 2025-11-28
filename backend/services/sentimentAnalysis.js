class SentimentAnalysis {
  constructor() {
    this.disasterKeywords = {
      earthquake: ['earthquake', 'tremor', 'shaking', 'quake'],
      flood: ['flood', 'flooding', 'water', 'submerged', 'inundated'],
      fire: ['fire', 'burning', 'smoke', 'flames', 'wildfire'],
      storm: ['storm', 'hurricane', 'cyclone', 'tornado', 'wind']
    };
    
    this.urgencyWords = ['help', 'emergency', 'urgent', 'trapped', 'rescue', 'danger'];
  }

  analyzeSocialPost(text, location) {
    const analysis = {
      disasterType: null,
      urgencyLevel: 0,
      sentiment: 'neutral',
      confidence: 0,
      location: location,
      timestamp: new Date()
    };

    const lowerText = text.toLowerCase();
    
    // Detect disaster type
    for (const [type, keywords] of Object.entries(this.disasterKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        analysis.disasterType = type;
        analysis.confidence += matches.length * 20;
        break;
      }
    }

    // Calculate urgency
    const urgencyMatches = this.urgencyWords.filter(word => lowerText.includes(word));
    analysis.urgencyLevel = Math.min(urgencyMatches.length * 25, 100);

    // Determine sentiment
    if (urgencyMatches.length > 0 || analysis.disasterType) {
      analysis.sentiment = 'negative';
    }

    analysis.confidence = Math.min(analysis.confidence, 100);
    
    return analysis;
  }

  processHashtags(hashtags) {
    const disasterHashtags = [];
    const emergencyHashtags = ['#emergency', '#help', '#rescue', '#disaster', '#alert'];
    
    hashtags.forEach(tag => {
      if (emergencyHashtags.includes(tag.toLowerCase())) {
        disasterHashtags.push(tag);
      }
    });
    
    return disasterHashtags;
  }
}

module.exports = new SentimentAnalysis();