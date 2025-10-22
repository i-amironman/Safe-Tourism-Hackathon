const express = require('express');
const router = express.Router();

// Cache for hospital images to avoid repeated API calls
const imageCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Multiple free image APIs for comprehensive hospital coverage
const IMAGE_APIS = [
  {
    name: 'Unsplash',
    search: async (query) => {
      try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' hospital medical building')}&per_page=5&client_id=2Fq9kKX2jB7x8H9J4m5oN6p7Q8r9s0t1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      } catch (error) {
        console.log('Unsplash API failed:', error.message);
      }
      return null;
    }
  },
  {
    name: 'Pexels',
    search: async (query) => {
      try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' hospital medical center')}&per_page=5`, {
          headers: { 'Authorization': '563492ad6f917000010000014a3c4f5e' }
        });
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          return data.photos[0].src.large;
        }
      } catch (error) {
        console.log('Pexels API failed:', error.message);
      }
      return null;
    }
  },
  {
    name: 'Pixabay',
    search: async (query) => {
      try {
        const response = await fetch(`https://pixabay.com/api/?key=28139951-4f0a9a5c8c8c8c8c8c8c8c8c&q=${encodeURIComponent(query + ' hospital medical')}&image_type=photo&category=places&per_page=5`);
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          return data.hits[0].webformatURL;
        }
      } catch (error) {
        console.log('Pixabay API failed:', error.message);
      }
      return null;
    }
  },
  {
    name: 'Flickr',
    search: async (query) => {
      try {
        const response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=6b0c8a7c8c8c8c8c8c8c8c8c8c8c8c8c&text=${encodeURIComponent(query + ' hospital medical center')}&per_page=5&sort=relevance&format=json&nojsoncallback=1`);
        const data = await response.json();
        if (data.photos && data.photos.photo && data.photos.photo.length > 0) {
          const photo = data.photos.photo[0];
          return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
        }
      } catch (error) {
        console.log('Flickr API failed:', error.message);
      }
      return null;
    }
  }
];

// Fallback hospital images by type
const FALLBACK_IMAGES = {
  hospital: [
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/542763/pexels-photo-542763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80'
  ],
  clinic: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  doctors: [
    'https://images.unsplash.com/photo-1584467735871-8ec4ba42c756?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  pharmacy: [
    'https://images.unsplash.com/photo-1585435557343-3b092031ae4b?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/3844744/pexels-photo-3844744.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  dentist: [
    'https://images.unsplash.com/photo-1600950335869-4773b8a6fddf?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/567949/pexels-photo-567949.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ],
  default: [
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.pexels.com/photos/542763/pexels-photo-542763.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80'
  ]
};

// Clean and normalize hospital name for better search results
function normalizeHospitalName(name) {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+(hospital|medical center|clinic|medical|healthcare|health|center|centre)/gi, '') // Remove common suffixes
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Generate search variations for fuzzy matching
function generateSearchVariations(cleanName) {
  const variations = [
    cleanName,
    cleanName.split(' ')[0], // First word only
    cleanName.split(' ').slice(0, 2).join(' '), // First two words
    cleanName.split(' ').slice(-2).join(' '), // Last two words
  ].filter(variation => variation.length > 2); // Filter out very short terms

  // Add unique variations
  return [...new Set(variations)];
}

// Get cached image or fetch new one
async function getHospitalImage(hospitalName, hospitalType = 'hospital') {
  const cacheKey = `${hospitalName.toLowerCase()}-${hospitalType}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.imageUrl;
    }
  }

  const cleanName = normalizeHospitalName(hospitalName);
  const searchVariations = generateSearchVariations(cleanName);

  // Try each API with each search variation
  for (const api of IMAGE_APIS) {
    for (const variation of searchVariations) {
      try {
        console.log(`Trying ${api.name} with query: "${variation}"`);
        const imageUrl = await api.search(variation);
        
        if (imageUrl) {
          // Cache the result
          imageCache.set(cacheKey, {
            imageUrl,
            timestamp: Date.now()
          });
          
          console.log(`Found image via ${api.name}: ${imageUrl}`);
          return imageUrl;
        }
      } catch (error) {
        console.log(`${api.name} failed for variation "${variation}":`, error.message);
      }
    }
  }

  // All APIs failed, use fallback
  const fallbackImages = FALLBACK_IMAGES[hospitalType] || FALLBACK_IMAGES.default;
  const fallbackImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  
  // Cache fallback result
  imageCache.set(cacheKey, {
    imageUrl: fallbackImage,
    timestamp: Date.now()
  });
  
  console.log(`Using fallback image for ${hospitalName}: ${fallbackImage}`);
  return fallbackImage;
}

// API endpoint to get hospital image
router.get('/search', async (req, res) => {
  try {
    const { hospitalName, hospitalType } = req.query;
    
    if (!hospitalName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Hospital name is required' 
      });
    }

    const imageUrl = await getHospitalImage(hospitalName, hospitalType || 'hospital');
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      hospitalName: hospitalName,
      hospitalType: hospitalType || 'hospital'
    });
    
  } catch (error) {
    console.error('Hospital image search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch hospital image' 
    });
  }
});

// Clear cache endpoint (for debugging)
router.post('/clear-cache', (req, res) => {
  imageCache.clear();
  res.json({ 
    success: true, 
    message: 'Cache cleared successfully' 
  });
});

// Get cache stats
router.get('/cache-stats', (req, res) => {
  res.json({
    success: true,
    cacheSize: imageCache.size,
    cachedHospitals: Array.from(imageCache.keys())
  });
});

module.exports = router;