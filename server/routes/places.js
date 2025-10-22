
const express = require('express');
const router = express.Router();

/**
 * Places API using Overpass API (OpenStreetMap data) with enhanced image sources
 * 
 * IMAGE SOURCES (in priority order):
 * 1. Foursquare Photos API - Real photos of the specific place
 * 2. Unsplash - High-quality generic medical images
 * 3. Wikimedia Commons - Open-source medical facility photos
 * 4. Flickr CC - Creative Commons medical images
 * 
 * DIRECTIONS: OpenRouteService API (free, OpenStreetMap based)
 * 
 * RATE LIMITS & USAGE:
 * - Overpass API has rate limits and may block heavy usage
 * - Implement caching for production use
 * - Consider running your own Overpass instance for high traffic
 * 
 * GET /places?lat=&lng=&type=
 * 
 * Query params:
 * - lat: latitude (required)
 * - lng: longitude (required)
 * - type: tourist|hotel|hospital (required)
 */

// Helper function to build Overpass QL query based on type
function buildOverpassQuery(lat, lng, type, radius = 2000) {
  let filter = '';
  
  switch (type) {
    case 'hospital':
      // Query for hospitals, clinics, and medical facilities
      filter = `
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="clinic"](around:${radius},${lat},${lng});
          way["amenity"="clinic"](around:${radius},${lat},${lng});
          node["amenity"="doctors"](around:${radius},${lat},${lng});
          way["amenity"="doctors"](around:${radius},${lat},${lng});
          node["healthcare"](around:${radius},${lat},${lng});
          way["healthcare"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    case 'hotel':
      // Query for hotels, motels, guest houses, and hostels
      filter = `
        (
          node["tourism"="hotel"](around:${radius},${lat},${lng});
          way["tourism"="hotel"](around:${radius},${lat},${lng});
          node["tourism"="motel"](around:${radius},${lat},${lng});
          way["tourism"="motel"](around:${radius},${lat},${lng});
          node["tourism"="guest_house"](around:${radius},${lat},${lng});
          way["tourism"="guest_house"](around:${radius},${lat},${lng});
          node["tourism"="hostel"](around:${radius},${lat},${lng});
          way["tourism"="hostel"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    case 'tourist':
      // Query for tourist attractions, museums, viewpoints
      filter = `
        (
          node["tourism"="attraction"](around:${radius},${lat},${lng});
          way["tourism"="attraction"](around:${radius},${lat},${lng});
          node["tourism"="museum"](around:${radius},${lat},${lng});
          way["tourism"="museum"](around:${radius},${lat},${lng});
          node["tourism"="viewpoint"](around:${radius},${lat},${lng});
          node["tourism"="gallery"](around:${radius},${lat},${lng});
          way["tourism"="gallery"](around:${radius},${lat},${lng});
          node["historic"](around:${radius},${lat},${lng});
          way["historic"](around:${radius},${lat},${lng});
        );
      `;
      break;
      
    default:
      throw new Error('Invalid type parameter');
  }
  
  return `[out:json][timeout:25];${filter}out center;`;
}

// Enhanced image fetching with multiple sources and caching
const imageCache = new Map(); // Simple in-memory cache

async function getHospitalImage(hospital) {
  const name = hospital.name || 'Unnamed';
  const tags = hospital.tags || {};
  const healthcareType = tags.healthcare || tags.amenity || '';
  const lat = hospital.lat;
  const lng = hospital.lng;
  
  // Create cache key
  const cacheKey = `${name}-${healthcareType}-${lat}-${lng}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }
  
  let imageUrl = null;
  
  try {
    // Try Foursquare Photos API first for real photos of this specific place
    const foursquareImage = await getFoursquarePhoto(name, lat, lng);
    if (foursquareImage) {
      imageUrl = foursquareImage;
      console.log(`Using Foursquare image for: ${name}`);
    }
  } catch (error) {
    console.log('Foursquare API failed, trying next source:', error.message);
  }
  
  if (!imageUrl) {
    try {
      // Try Wikimedia Commons for medical facility photos
      const wikimediaImage = await getWikimediaImage(name, healthcareType);
      if (wikimediaImage) {
        imageUrl = wikimediaImage;
        console.log(`Using Wikimedia image for: ${name}`);
      }
    } catch (error) {
      console.log('Wikimedia API failed, trying next source:', error.message);
    }
  }
  
  if (!imageUrl) {
    try {
      // Try Flickr CC for creative commons medical images
      const flickrImage = await getFlickrImage(name, healthcareType);
      if (flickrImage) {
        imageUrl = flickrImage;
        console.log(`Using Flickr image for: ${name}`);
      }
    } catch (error) {
      console.log('Flickr API failed, using fallback:', error.message);
    }
  }
  
  // Fallback to Unsplash with enhanced logic
  if (!imageUrl) {
    imageUrl = getUnsplashImage(hospital);
    console.log(`Using Unsplash image for: ${name} -> ${imageUrl.substring(0, 50)}...`);
  }
  
  // Cache the result (cache for 1 hour)
  imageCache.set(cacheKey, imageUrl);
  setTimeout(() => {
    imageCache.delete(cacheKey);
  }, 3600000); // 1 hour
  
  return imageUrl;
}

// Foursquare Photos API for real place photos
async function getFoursquarePhoto(name, lat, lng) {
  try {
    // Note: You'll need to add FOURSQUARE_API_KEY to your .env file
    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      console.log('Foursquare API key not configured');
      return null;
    }
    
    const searchQuery = encodeURIComponent(name);
    const url = `https://api.foursquare.com/v3/places/search?query=${searchQuery}&ll=${lat},${lng}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      if (place.fsq_id) {
        // Get photos for this place
        const photosUrl = `https://api.foursquare.com/v3/places/${place.fsq_id}/photos?limit=1`;
        const photosResponse = await fetch(photosUrl, {
          headers: {
            'Authorization': apiKey,
            'Accept': 'application/json'
          }
        });
        
        if (photosResponse.ok) {
          const photosData = await photosResponse.json();
          if (photosData.length > 0) {
            const photo = photosData[0];
            // Construct photo URL
            return `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Foursquare API error:', error);
    return null;
  }
}

// Wikimedia Commons for medical facility photos
async function getWikimediaImage(name, healthcareType) {
  try {
    const searchTerms = getWikimediaSearchTerms(name, healthcareType);
    const query = encodeURIComponent(searchTerms);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|dimensions|extmetadata&generator=search&gsrsearch=${query}&gsrlimit=1&gsrnamespace=6&origin=*`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Wikimedia API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages);
      if (pages.length > 0 && pages[0].imageinfo && pages[0].imageinfo.length > 0) {
        const imageUrl = pages[0].imageinfo[0].url;
        // Check if image is appropriate (medical facility)
        if (isMedicalImage(imageUrl, pages[0].title)) {
          return imageUrl;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Wikimedia API error:', error);
    return null;
  }
}

// Flickr CC for creative commons medical images
async function getFlickrImage(name, healthcareType) {
  try {
    // Note: You'll need to add FLICKR_API_KEY to your .env file
    const apiKey = process.env.FLICKR_API_KEY;
    if (!apiKey) {
      console.log('Flickr API key not configured');
      return null;
    }
    
    const tags = getFlickrTags(name, healthcareType);
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tags}&tag_mode=all&license=1,2,3,4,5,6,7,8&sort=relevance&per_page=1&format=json&nojsoncallback=1`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Flickr API error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.photos && data.photos.photo && data.photos.photo.length > 0) {
      const photo = data.photos.photo[0];
      // Construct photo URL
      return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
    }
    
    return null;
  } catch (error) {
    console.error('Flickr API error:', error);
    return null;
  }
}

// Enhanced Unsplash fallback with unique image generation
function getUnsplashImage(hospital) {
  const name = (hospital.name || '').toLowerCase();
  const tags = hospital.tags || {};
  const healthcareType = tags.healthcare || tags.amenity || '';
  
  // Generate unique seed based on hospital name and type for consistent unique images
  const uniqueSeed = generateUniqueImageSeed(hospital);
  
  // Create a more reliable Unsplash URL with multiple keywords
  const baseKeywords = 'hospital,medical,healthcare';
  const timestamp = Date.now(); // Add timestamp to prevent caching issues
  
  // Specialized hospitals based on name
  if (name.includes('medical center') || name.includes('medical centre')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},medical-center,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('children') || name.includes('pediatric')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},pediatric-hospital,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('heart') || name.includes('cardiac') || name.includes('cardio')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},cardiac-hospital,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('cancer') || name.includes('oncology')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},cancer-hospital,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('eye') || name.includes('ophthalm')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},eye-hospital,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('bone') || name.includes('orthoped')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},orthopedic-hospital,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('mental') || name.includes('psychiatric')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},mental-health-facility,${uniqueSeed}&t=${timestamp}`;
  }
  if (name.includes('emergency') || name.includes('er')) {
    return `https://source.unsplash.com/400x300/?${baseKeywords},emergency-room,${uniqueSeed}&t=${timestamp}`;
  }
  
  // Based on healthcare type with unique variations
  switch (healthcareType) {
    case 'hospital':
      return `https://source.unsplash.com/400x300/?${baseKeywords},hospital-building,${uniqueSeed}&t=${timestamp}`;
    case 'clinic':
      return `https://source.unsplash.com/400x300/?${baseKeywords},medical-clinic,${uniqueSeed}&t=${timestamp}`;
    case 'doctors':
      return `https://source.unsplash.com/400x300/?${baseKeywords},doctors-office,${uniqueSeed}&t=${timestamp}`;
    case 'dentist':
      return `https://source.unsplash.com/400x300/?${baseKeywords},dental-clinic,${uniqueSeed}&t=${timestamp}`;
    case 'pharmacy':
      return `https://source.unsplash.com/400x300/?${baseKeywords},pharmacy-store,${uniqueSeed}&t=${timestamp}`;
    case 'laboratory':
      return `https://source.unsplash.com/400x300/?${baseKeywords},medical-laboratory,${uniqueSeed}&t=${timestamp}`;
    case 'physiotherapist':
      return `https://source.unsplash.com/400x300/?${baseKeywords},physiotherapy-clinic,${uniqueSeed}&t=${timestamp}`;
    case 'alternative':
      return `https://source.unsplash.com/400x300/?${baseKeywords},alternative-medicine,${uniqueSeed}&t=${timestamp}`;
    case 'blood_bank':
      return `https://source.unsplash.com/400x300/?${baseKeywords},blood-donation-center,${uniqueSeed}&t=${timestamp}`;
    case 'vaccination_centre':
      return `https://source.unsplash.com/400x300/?${baseKeywords},vaccination-center,${uniqueSeed}&t=${timestamp}`;
    default:
      // Default hospital images with unique seed for variety
      return `https://source.unsplash.com/400x300/?${baseKeywords},${uniqueSeed}&t=${timestamp}`;
  }
}

// Generate unique seed for image generation based on hospital details
function generateUniqueImageSeed(hospital) {
  const name = hospital.name || 'unnamed';
  const type = hospital.tags?.healthcare || hospital.tags?.amenity || 'medical';
  const lat = Math.round(hospital.lat * 1000); // Round to avoid precision issues
  const lng = Math.round(hospital.lng * 1000);
  
  // Create a unique hash from hospital details
  const combinedString = `${name}-${type}-${lat}-${lng}`;
  const hash = btoa(combinedString).substring(0, 8).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Add some randomness for variety while maintaining consistency
  const randomSuffix = Math.abs(hash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000;
  return `${hash}${randomSuffix}`;
}



// Helper functions for image APIs
function getWikimediaSearchTerms(name, healthcareType) {
  const baseTerms = ['hospital', 'medical', 'clinic', 'healthcare'];
  const typeTerms = {
    'hospital': 'hospital building',
    'clinic': 'medical clinic',
    'pharmacy': 'pharmacy drugstore',
    'dentist': 'dental clinic',
    'laboratory': 'medical laboratory'
  };
  
  return `${name} ${typeTerms[healthcareType] || baseTerms[0]}`;
}

function getFlickrTags(name, healthcareType) {
  const tags = ['hospital', 'medical', 'healthcare', 'clinic'];
  if (healthcareType) {
    tags.push(healthcareType);
  }
  return tags.join(',');
}

function isMedicalImage(imageUrl, title) {
  const medicalKeywords = ['hospital', 'medical', 'clinic', 'healthcare', 'pharmacy', 'dental'];
  const titleLower = title.toLowerCase();
  return medicalKeywords.some(keyword => titleLower.includes(keyword));
}

// Normalize Overpass API response with async image fetching and unique image prioritization
async function normalizeOverpassData(elements) {
  const hospitals = elements.map(element => {
    // Get coordinates (handle both nodes and ways)
    const lat = element.lat || (element.center && element.center.lat) || null;
    const lng = element.lon || (element.center && element.center.lon) || null;
    
    if (!lat || !lng) {
      return null; // Skip elements without coordinates
    }
    
    return {
      id: element.id,
      name: element.tags?.name || 'Unnamed',
      lat,
      lng,
      tags: element.tags || {},
      type: element.type, // 'node' or 'way'
    };
  }).filter(item => item !== null); // Remove null entries
  
  // Fetch images for all hospitals in parallel with better error handling
  const hospitalsWithImages = await Promise.all(
    hospitals.map(async (hospital) => {
      try {
        const imageUrl = await getHospitalImage(hospital);
        // Ensure we always have a valid image URL
        hospital.image = imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80';
        console.log(`✓ Image assigned to ${hospital.name}: ${hospital.image.substring(0, 50)}...`);
      } catch (error) {
        console.error(`✗ Failed to fetch image for hospital: ${hospital.name}`, error.message);
        // Always provide a fallback image
        hospital.image = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80';
      }
      return hospital;
    })
  );
  
  // Sort hospitals by image uniqueness - unique images first, then similar/duplicate images
  hospitalsWithImages.sort((a, b) => {
    const signatureA = getImageSignature(a.image);
    const signatureB = getImageSignature(b.image);
    
    // Count how many hospitals have the same image signature
    const countSimilar = (signature, hospitals) => {
      return hospitals.filter(h => getImageSignature(h.image) === signature).length;
    };
    
    const countA = countSimilar(signatureA, hospitalsWithImages);
    const countB = countSimilar(signatureB, hospitalsWithImages);
    
    // Hospitals with unique images (count = 1) come first
    if (countA === 1 && countB > 1) return -1;
    if (countB === 1 && countA > 1) return 1;
    
    // If both have same uniqueness level, sort by name
    if (countA === countB) {
      return a.name.localeCompare(b.name);
    }
    
    // More unique images come first (lower count = higher priority)
    return countA - countB;
  });
  
  // Log the uniqueness results
  const imageGroups = {};
  hospitalsWithImages.forEach(hospital => {
    const signature = getImageSignature(hospital.image);
    if (!imageGroups[signature]) {
      imageGroups[signature] = [];
    }
    imageGroups[signature].push(hospital.name);
  });
  
  const uniqueImages = Object.values(imageGroups).filter(group => group.length === 1).length;
  const duplicateGroups = Object.values(imageGroups).filter(group => group.length > 1);
  const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length, 0);
  
  console.log(`🖼️ Image Uniqueness Analysis:`);
  console.log(`   🎯 Unique images: ${uniqueImages} hospitals`);
  console.log(`   🔄 Similar/duplicate images: ${totalDuplicates} hospitals in ${duplicateGroups.length} groups`);
  console.log(`📈 Sorted results: Unique images appear first!`);
  
  console.log(`Processed ${hospitalsWithImages.length} hospitals with uniqueness prioritization`);
  return hospitalsWithImages;
}

// Helper function to extract image signature (moved outside for reuse)
function getImageSignature(imageUrl) {
  // For Unsplash images, extract the seed/signature part from query parameters
  if (imageUrl.includes('source.unsplash.com')) {
    const match = imageUrl.match(/,([^&?]+)(?:&t=|\?|$)/);
    return match ? match[1] : imageUrl;
  }
  // For other images, use the full URL as signature
  return imageUrl;
}

router.get('/', async (req, res) => {
  try {
    const { lat, lng, type } = req.query;
    
    // Validate required parameters
    if (!lat || !lng || !type) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat, lng, type' 
      });
    }
    
    // Validate lat/lng are numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        error: 'Invalid lat/lng values' 
      });
    }
    
    // Validate type
    const validTypes = ['tourist', 'hotel', 'hospital'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
      });
    }
    
    // Build Overpass query
    const query = buildOverpassQuery(latitude, longitude, type);
    
    // Fetch from Overpass API
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Normalize and return results
    const places = await normalizeOverpassData(data.elements || []);
    
    res.json({
      success: true,
      count: places.length,
      query: { lat: latitude, lng: longitude, type },
      places,
    });
    
  } catch (error) {
    console.error('Places API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch places data',
      message: error.message 
    });
  }
});

module.exports = router;
