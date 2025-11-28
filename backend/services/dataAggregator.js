const axios = require('axios');
const Alert = require('../models/Alert');
const News = require('../models/News');

// Location mapping for major cities
const cityCoordinates = {
  'mumbai': [72.8777, 19.0760],
  'delhi': [77.1025, 28.7041],
  'bangalore': [77.5946, 12.9716],
  'hyderabad': [78.4867, 17.3850],
  'chennai': [80.2707, 13.0827],
  'kolkata': [88.3639, 22.5726],
  'pune': [73.8567, 18.5204],
  'ahmedabad': [72.5714, 23.0225],
  'jaipur': [75.7873, 26.9124],
  'lucknow': [80.9462, 26.8467]
};

const getLocationCoordinates = (text) => {
  const lowerText = text.toLowerCase();
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (lowerText.includes(city)) {
      return coords;
    }
  }
  // Default to India center if no city found
  return [78.9629, 20.5937];
};

const fetchUSGSData = async () => {
  try {
    const response = await axios.get(process.env.USGS_API_URL);
    const earthquakes = response.data.features;
    
    for (const eq of earthquakes) {
      const existing = await Alert.findOne({ 
        source: 'USGS',
        'location.coordinates': eq.geometry.coordinates 
      });
      
      if (!existing) {
        const alert = new Alert({
          type: 'earthquake',
          severity: eq.properties.mag > 6 ? 'critical' : eq.properties.mag > 4 ? 'high' : 'medium',
          location: {
            type: 'Point',
            coordinates: [eq.geometry.coordinates[0], eq.geometry.coordinates[1]],
            address: eq.properties.place
          },
          magnitude: eq.properties.mag,
          description: `Magnitude ${eq.properties.mag} earthquake`,
          source: 'USGS'
        });
        
        await alert.save();
      }
    }
  } catch (error) {
    console.error('USGS fetch error:', error.message);
  }
};

const fetchNewsData = async () => {
  try {
    const disasterKeywords = 'earthquake OR flood OR cyclone OR fire OR landslide OR tsunami';
    const response = await axios.get(process.env.NEWS_API_URL, {
      params: {
        q: `${disasterKeywords} AND India`,
        sortBy: 'publishedAt',
        pageSize: 20,
        language: 'en',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    for (const article of response.data.articles || []) {
      const existing = await News.findOne({ link: article.url });
      
      if (!existing) {
        // Classify disaster type
        const title = article.title.toLowerCase();
        let disasterType = 'general';
        let severity = 'medium';
        
        if (title.includes('earthquake')) {
          disasterType = 'earthquake';
          severity = title.includes('major') || title.includes('strong') ? 'high' : 'medium';
        } else if (title.includes('flood')) {
          disasterType = 'flood';
          severity = title.includes('severe') || title.includes('heavy') ? 'high' : 'medium';
        } else if (title.includes('cyclone') || title.includes('hurricane')) {
          disasterType = 'cyclone';
          severity = 'high';
        } else if (title.includes('fire')) {
          disasterType = 'fire';
          severity = 'medium';
        }

        // Get coordinates based on location mentioned in article
        const coords = getLocationCoordinates(article.title + ' ' + (article.description || ''));
        
        // Save news
        const news = new News({
          headline: article.title,
          category: disasterType,
          severity: severity,
          link: article.url,
          source: article.source.name,
          content: article.description
        });
        await news.save();

        // Create alert if it's a significant disaster
        if (disasterType !== 'general') {
          const alert = new Alert({
            type: disasterType,
            severity: severity,
            location: {
              type: 'Point',
              coordinates: coords,
              address: 'India'
            },
            description: article.title,
            source: 'NewsAPI'
          });
          await alert.save();
        }
      }
    }
  } catch (error) {
    console.error('News API error:', error.message);
  }
};

module.exports = (io) => {
  // Initial fetch
  fetchUSGSData();
  fetchNewsData();
  
  // Fetch data every 10 minutes
  setInterval(async () => {
    console.log('Fetching disaster data...');
    await fetchUSGSData();
    await fetchNewsData();
    
    // Emit new alerts to connected clients
    const recentAlerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    io.emit('newAlerts', recentAlerts);
  }, 10 * 60 * 1000);
};