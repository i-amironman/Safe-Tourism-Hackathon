const express = require('express');
const router = express.Router();

// GET /crime?lat=&lng=&radius=
// Returns crime statistics from UK Police API
// NOTE: This API only covers England, Wales, and Northern Ireland
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude'
      });
    }

    // UK Police API endpoint for street-level crimes
    // Note: This API has rate limits (15 requests per second, 1000 per hour per IP)
    const apiUrl = `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=2023-01`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      // If outside UK coverage or API error
      if (response.status === 404) {
        return res.json({
          success: true,
          coverage: 'uk_only',
          message: 'Crime data is only available for England, Wales, and Northern Ireland',
          total: 0,
          byCategory: {},
          crimeScore: 0,
          lastUpdated: null
        });
      }
      throw new Error(`Police API error: ${response.status}`);
    }

    const crimes = await response.json();

    // Aggregate by category and keep individual crime locations
    const byCategory = {};
    const crimeLocations = [];
    
    crimes.forEach(crime => {
      const category = crime.category || 'unknown';
      byCategory[category] = (byCategory[category] || 0) + 1;
      
      // Add individual crime location data
      if (crime.location && crime.location.latitude && crime.location.longitude) {
        crimeLocations.push({
          category: category,
          latitude: parseFloat(crime.location.latitude),
          longitude: parseFloat(crime.location.longitude),
          location_type: crime.location.type || 'Force',
          street_name: crime.location.street && crime.location.street.name ? crime.location.street.name : 'Unknown Street'
        });
      }
    });

    // Calculate tourist-friendly crime score (0-100, where 100 is highest risk)
    // Uses threshold-based scaling to avoid scaring tourists with historical data
    const total = crimes.length;
    let crimeScore;
    
    // Threshold-based scaling for tourist-friendly scores
    const maxThreshold = 5000; // Maximum expected crimes in an area
    const scalingFactor = 50; // Maximum score we want to show even for high-crime areas
    
    if (total <= 50) {
      // Low crime areas: Linear scaling up to 25/100
      crimeScore = Math.round((total / 50) * 25);
    } else if (total <= 200) {
      // Medium crime areas: Gradual increase from 25-45/100
      crimeScore = Math.round(25 + ((total - 50) / 150) * 20);
    } else if (total <= 1000) {
      // High crime areas: Slower increase from 45-65/100
      crimeScore = Math.round(45 + ((total - 200) / 800) * 20);
    } else {
      // Very high crime areas: Logarithmic scaling to cap at 75/100
      const excess = total - 1000;
      const logarithmicIncrease = Math.log10(excess + 1) / Math.log10(maxThreshold - 1000 + 1) * 10;
      crimeScore = Math.min(75, Math.round(65 + logarithmicIncrease));
    }
    
    // Apply final scaling factor to make it even more tourist-friendly
    crimeScore = Math.round(crimeScore * (scalingFactor / 100));
    
    // Ensure minimum score of 5 for areas with any crime, and maximum of scalingFactor
    crimeScore = total > 0 ? Math.max(5, Math.min(scalingFactor, crimeScore)) : 0;

    // Get the latest crime date
    const lastUpdated = crimes.length > 0
      ? crimes.reduce((latest, crime) => {
          const crimeDate = new Date(crime.month);
          return crimeDate > latest ? crimeDate : latest;
        }, new Date(0))
      : null;

    res.json({
      success: true,
      coverage: 'uk_only',
      message: 'Data covers England, Wales, and Northern Ireland only. Shows crimes from most recent month available.',
      total,
      byCategory,
      crimeLocations, // Add individual crime locations
      crimeScore,
      lastUpdated: lastUpdated ? lastUpdated.toISOString() : null,
      limitations: [
        'UK coverage only (England, Wales, Northern Ireland)',
        'Data shows single month snapshot (most recent available)',
        'Crime score is simplified calculation',
        'API rate limited: 15 req/sec, 1000 req/hour',
        'Full risk analysis would require historical data aggregation'
      ]
    });

  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crime data',
      message: error.message
    });
  }
});

module.exports = router;