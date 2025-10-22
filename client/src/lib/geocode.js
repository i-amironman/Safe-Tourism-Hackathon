
/**
 * Geocode a location query using Nominatim API (OpenStreetMap)
 * 
 * IMPORTANT: Nominatim Usage Policy
 * - Maximum 1 request per second
 * - Please add appropriate delays between requests
 * - Consider caching results for repeated queries
 * - For heavy usage, consider setting up your own Nominatim instance
 * 
 * @param {string} query - Location search query (e.g., "New York", "1600 Amphitheatre Parkway")
 * @returns {Promise<Object|null>} Object with {lat, lng, display_name} or null if not found
 */
export async function geocode(query) {
  if (!query || query.trim().length === 0) {
    console.warn('Geocode: Empty query provided');
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      format: 'json',
      limit: '1',
      addressdetails: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'SafeTravel-App/1.0', // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn('Geocode: No results found for query:', query);
      return null;
    }

    const result = data[0];
    
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
      address: result.address,
      bbox: result.boundingbox,
    };
  } catch (error) {
    console.error('Geocode error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address information
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object|null>} Address information or null
 */
export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) {
    console.warn('Reverse geocode: Invalid coordinates');
    return null;
  }

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          'User-Agent': 'SafeTravel-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.error) {
      console.warn('Reverse geocode: No results found');
      return null;
    }

    return {
      display_name: data.display_name,
      address: data.address,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
}
