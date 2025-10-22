const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://safe-tourism-api.onrender.com');

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: '/auth',
    places: '/places',
    crime: '/crime',
    route: '/route',
    user: '/user',
    countries: '/api/countries',
    cultures: '/api/cultures',
    popularPlaces: '/api/popular-places',
    hotelImages: '/api/hotel-images',
    hospitalImages: '/api/hospital-images',
    health: '/health',
    test: '/api/test'
  }
};

export default API_CONFIG;