
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import { geocode } from '../lib/geocode';
// Popular Places Data (Top visited global destinations)
const popularPlaces = [
  {
    id: "paris",
    name: "Paris",
    location: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "City of Light with iconic Eiffel Tower"
  },
  {
    id: "tokyo",
    name: "Tokyo",
    location: "Japan", 
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Modern metropolis with ancient traditions"
  },
  {
    id: "new-york",
    name: "New York",
    location: "United States",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "The city that never sleeps"
  },
  {
    id: "dubai",
    name: "Dubai",
    location: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Modern oasis with stunning architecture"
  },
  {
    id: "rome",
    name: "Rome",
    location: "Italy",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Eternal city with ancient history"
  },
  {
    id: "bali",
    name: "Bali",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Tropical paradise with rich culture"
  },
  {
    id: "london",
    name: "London",
    location: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Historic capital with royal heritage"
  },
  {
    id: "barcelona",
    name: "Barcelona",
    location: "Spain",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Vibrant city with Gaudí's masterpieces"
  }
];

// Cultures Data with diverse global cultures
const cultures = [
  {
    id: "japanese",
    name: "Japanese Culture",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    description: "Ancient traditions meet modern innovation"
  },
  {
    id: "indian",
    name: "Indian Culture",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/people-and-culture-hero-new?qlt=82&ts=1726640287102",
    description: "Diverse festivals and vibrant traditions"
  },
  {
    id: "mediterranean",
    name: "Mediterranean Culture",
    image: "https://images.fineartamerica.com/images-medium-large-5/romantic-travel-destination-oia-mbbirdy.jpg",
    description: "Rich heritage and diverse communities"
  },
  {
    id: "nordic",
    name: "Nordic Culture",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description: "Art, history, and architectural marvels"
  },
  {
    id: "latin-american",
    name: "Latin American Culture",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80",
    description: "Passionate music and colorful celebrations"
  },
  {
    id: "middle-eastern",
    name: "Middle Eastern Culture",
    image: "https://cms-b-assets.familysearch.org/dims4/default/abc5aff/2147483647/strip/true/crop/800x500+0+0/resize/800x500!/format/webp/quality/90/?url=http%3A%2F%2Ffh.familysearch.org%2Fsystem%2Ffiles%2Fteam%2Fait%2Fimages%2Fblog%2Fdome-of-the-rock-jerusalem.jpg",
    description: "Ancient civilizations and modern wonders"
  }
];

// Popular Countries Data (Extended to 40 countries)
const allCountries = [
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "United States", flag: "🇺🇸" },
  { name: "India", flag: "🇮🇳" },
  { name: "China", flag: "🇨🇳" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Austria", flag: "🇦🇹" }
];

// Default 16 countries for initial display
const defaultCountries = allCountries.slice(0, 16);

export default function Home() {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default: London
  const [mapZoom, setMapZoom] = useState(13);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [waypoints, setWaypoints] = useState([{ query: '' }, { query: '' }]);
  const [routeMode, setRouteMode] = useState('car');
  const [pathType, setPathType] = useState('shortest');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [crimeData, setCrimeData] = useState([]);

  // Generate crime bubbles based on actual crime locations and category counts
  const generateCrimeBubbles = (byCategory, crimeLocations, centerLat, centerLng) => {
    if (!byCategory || Object.keys(byCategory).length === 0) return [];
    if (!crimeLocations || crimeLocations.length === 0) return [];

    const bubbles = [];
    
    // Define risk categories based on crime types
    const lowRiskCategories = ['theft', 'robbery', 'other-crime'];
    const mediumRiskCategories = ['shoplifting', 'public-order', 'burglary'];
    const highRiskCategories = ['vehicle-crime', 'criminal-damage-arson', 'anti-social-behaviour', 'possession-of-weapons', 'drugs', 'violent-crime'];
    
    // Group crimes by location and category
    const locationGroups = {};
    
    crimeLocations.forEach(crime => {
      const normalizedCategory = crime.category.toLowerCase().replace(/_/g, '-').replace(/ /g, '-');
      const key = `${crime.latitude.toFixed(4)},${crime.longitude.toFixed(4)}`; // Group nearby crimes
      
      if (!locationGroups[key]) {
        locationGroups[key] = {
          lat: crime.latitude,
          lng: crime.longitude,
          categories: {},
          street_name: crime.street_name,
          location_type: crime.location_type
        };
      }
      
      locationGroups[key].categories[normalizedCategory] = (locationGroups[key].categories[normalizedCategory] || 0) + 1;
    });

    // Create bubbles for each location group
    Object.values(locationGroups).forEach((locationGroup, index) => {
      const { lat, lng, categories, street_name, location_type } = locationGroup;
      
      // Calculate total crimes at this location
      const totalCrimesAtLocation = Object.values(categories).reduce((sum, count) => sum + count, 0);
      
      // Determine dominant risk level at this location
      let dominantRiskLevel = 'Low Risk';
      let dominantCategory = '';
      let maxCount = 0;
      
      Object.entries(categories).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantCategory = category;
          
          if (lowRiskCategories.includes(category)) {
            dominantRiskLevel = 'Low Risk';
          } else if (mediumRiskCategories.includes(category)) {
            dominantRiskLevel = 'Medium Risk';
          } else if (highRiskCategories.includes(category)) {
            dominantRiskLevel = 'High Risk';
          } else {
            dominantRiskLevel = 'Medium Risk'; // Default for unknown categories
          }
        }
      });
      
      // Calculate radius based on total crime count at this location
      let baseRadius = 30; // Smaller base radius for route visualization
      let radius;
      
      if (dominantRiskLevel === 'High Risk') {
        radius = baseRadius + (totalCrimesAtLocation * 10); // 10m per crime for high risk
      } else if (dominantRiskLevel === 'Medium Risk') {
        radius = baseRadius + (totalCrimesAtLocation * 8); // 8m per crime for medium risk
      } else {
        radius = baseRadius + (totalCrimesAtLocation * 5); // 5m per crime for low risk
      }
      
      // Cap maximum radius for route visualization
      radius = Math.min(radius, 150);
      
      // Set colors based on risk level
      let color, fillColor;
      if (dominantRiskLevel === 'High Risk') {
        color = '#dc2626';
        fillColor = '#dc2626';
      } else if (dominantRiskLevel === 'Medium Risk') {
        color = '#f97316';
        fillColor = '#f97316';
      } else {
        color = '#eab308';
        fillColor = '#eab308';
      }

      // Create category breakdown text
      const categoryBreakdown = Object.entries(categories)
        .map(([cat, count]) => `${cat.replace(/-/g, ' ')}: ${count}`)
        .join(', ');

      bubbles.push({
        lat: lat,
        lng: lng,
        category: dominantCategory.replace(/-/g, ' '),
        count: totalCrimesAtLocation,
        categories: categories,
        street_name: street_name,
        location_type: location_type,
        color: color,
        fillColor: fillColor,
        radius: radius,
        riskLevel: dominantRiskLevel,
        categoryBreakdown: categoryBreakdown
      });
    });

    return bubbles;
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setShowMap(true);

    try {
      const result = await geocode(query);
      
      if (result) {
        setMapCenter([result.lat, result.lng]);
        setMapZoom(14);
        setMarkers([
          {
            lat: result.lat,
            lng: result.lng,
            label: result.display_name,
          },
        ]);
      } else {
        setSearchError('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handlePlanRoute = () => {
    setShowMap(true);
    setShowRouteForm(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setShowRouteForm(false);
    setSearchError(null);
    setMarkers([]);
    setRoute(null);
    setRouteInfo(null);
    setCrimeData([]);
  };

  const handleCalculateRoute = async () => {
    setIsCalculatingRoute(true);
    setSearchError(null); // Clear any existing errors
    setRoute(null);
    setRouteInfo(null);
    setCrimeData([]);

    console.log('Starting route calculation with:', { waypoints, routeMode, pathType });

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Route calculation timed out')), 30000); // 30 second timeout
    });

    // Create route calculation promise
    const routePromise = (async () => {
      // Geocode all waypoints
      const geocodedWaypoints = await Promise.all(
        waypoints.map(async (wp) => {
          if (!wp.query.trim()) return null;
          const result = await geocode(wp.query);
          return result ? { lat: result.lat, lng: result.lng, query: wp.query } : null;
        })
      );

      const validWaypoints = geocodedWaypoints.filter(wp => wp !== null);

      if (validWaypoints.length < 2) {
        throw new Error('Please provide at least 2 valid locations');
      }

      // Call route API
      const response = await fetch('http://localhost:5000/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waypoints: validWaypoints,
          mode: routeMode,
          pathType: pathType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Route API error response:', errorText);
        throw new Error(`Route API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    })();

    try {
      // Show appropriate loading message based on route type
      if (pathType === 'safest') {
        // Update loading state for safest route
        const loadingElement = document.querySelector('.route-loading-message');
        if (loadingElement) {
          loadingElement.textContent = 'Calculating safest route... Fetching crime data for safety analysis.';
        }
      }

      // Race between route calculation and timeout
      const data = await Promise.race([routePromise, timeoutPromise]);

      if (data.success) {
        console.log('Route calculation successful:', data);
        setRoute({ geometry: data.route.geometry });
        setRouteInfo(data.route);
        
        // Create markers with proper types
        const routeMarkers = validWaypoints.map((wp, idx) => {
          let markerType = 'waypoint';
          if (idx === 0) markerType = 'start';
          else if (idx === validWaypoints.length - 1) markerType = 'end';
          
          return {
            lat: wp.lat,
            lng: wp.lng,
            label: wp.query || `Waypoint ${idx + 1}`,
            type: markerType,
          };
        });
        
        console.log('Setting markers:', routeMarkers);
        setMarkers(routeMarkers);

        // If safest route, fetch real crime data along the route
        if (pathType === 'safest' && data.route.geometry && data.route.geometry.coordinates) {
          const coordinates = data.route.geometry.coordinates;
          
          try {
            // Fetch crime data for multiple points along the route
            const crimeDataPromises = [];
            const step = Math.max(1, Math.floor(coordinates.length / 8)); // Sample ~8 points
            
            for (let i = 0; i < coordinates.length; i += step) {
              if (crimeDataPromises.length >= 8) break;
              
              const [lng, lat] = coordinates[i];
              
              // Fetch crime data for this point
              const crimePromise = fetch(
                `http://localhost:5000/crime?lat=${lat}&lng=${lng}`
              ).then(response => response.json())
                .then(crimeData => ({
                  lat: lat,
                  lng: lng,
                  crimeData: crimeData,
                  label: `Area ${crimeDataPromises.length + 1}`
                }))
                .catch(error => {
                  console.warn('Failed to fetch crime data for point:', error);
                  return null;
                });
              
              crimeDataPromises.push(crimePromise);
            }
            
            const crimeResults = await Promise.all(crimeDataPromises);
            const validCrimeData = crimeResults.filter(result => result !== null && result.crimeData.success);
            
            // Transform crime data for map visualization
            const mapCrimeData = validCrimeData.map(point => {
              const { crimeData, lat, lng, label } = point;
              
              // Use the same logic as Crime page to generate bubbles
              const bubbles = generateCrimeBubbles(crimeData.byCategory, crimeData.crimeLocations, lat, lng);
              
              return {
                lat: lat,
                lng: lng,
                crimeScore: crimeData.crimeScore,
                totalCrimes: crimeData.total,
                bubbles: bubbles,
                label: label
              };
            });
            
            setCrimeData(mapCrimeData);
            console.log('Setting real crime data:', mapCrimeData);
            
          } catch (error) {
            console.error('Error fetching crime data:', error);
            // Fallback to mock data if crime API fails
            setCrimeData([]);
          }
        } else if (pathType === 'shortest') {
          // For shortest route, show minimal crime data or none
          setCrimeData([]);
          console.log('Clearing crime data for shortest route');
        } else {
          setCrimeData([]);
        }
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      
      if (error.message === 'Route calculation timed out') {
        // Special handling for timeout
        if (pathType === 'safest') {
          setSearchError(
            <div className="space-y-3">
              <p>
                <strong>Safest route calculation timed out.</strong> This can happen when analyzing crime data for complex routes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setPathType('shortest');
                    setSearchError(null);
                    setTimeout(() => handleCalculateRoute(), 100);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  ⚡ Try Shortest Route (Fast)
                </button>
                <button
                  onClick={() => {
                    setSearchError(null);
                    setTimeout(() => handleCalculateRoute(), 100);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  🔄 Retry Safest Route
                </button>
              </div>
              <p className="text-xs text-gray-600">
                💡 Tip: Use shorter routes or fewer waypoints for faster safest route calculations.
              </p>
            </div>
          );
        } else {
          setSearchError('Route calculation timed out. Please try again.');
        }
      } else {
        setSearchError(`Failed to calculate route: ${error.message}`);
      }
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleSaveJourney = async () => {
    if (!routeInfo) {
      alert('No route to save');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: `Journey from ${waypoints[0].query} to ${waypoints[waypoints.length - 1].query}`,
          description: `${routeMode} route via ${pathType} path`,
          destinations: waypoints.map(wp => wp.query).filter(q => q.trim()),
          start: waypoints[0]?.query || '',
          end: waypoints[waypoints.length - 1]?.query || '',
          mode: routeMode,
          distance: routeInfo.distanceKm,
          duration: routeInfo.durationMin,
          riskScore: routeInfo.riskScore,
          metadata: {
            pathType: pathType,
            geometry: routeInfo.geometry
          }
        }),
      });

      if (response.status === 401) {
        alert('Please log in to save journeys');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save journey');
      }

      const data = await response.json();
      if (data.success) {
        alert('Journey saved successfully!');
      }
    } catch (error) {
      console.error('Error saving journey:', error);
      alert('Failed to save journey. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Search Bar */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-blue-600">SafeTravel</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Discover safe destinations around the world with real-time safety data and intelligent planning tools
            </p>
          </div>

          {/* Enhanced Search Bar - Centered */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex-1 flex items-center">
                    <div className="pl-6 pr-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a city, landmark, or destination..."
                      className="flex-1 px-2 py-4 text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </>
                    ) : (
                      <>
                        Search
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Search Error */}
            {searchError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {typeof searchError === 'string' ? searchError : searchError}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handlePlanRoute}
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Plan a Route
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real-time safety data
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Toggleable */}
      {showMap && (
        <section className="relative bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Map Header with Close Button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                <span className="text-sm text-gray-500">Live location view</span>
              </div>
              <button
                onClick={handleCloseMap}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Close map"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Route Planning Form */}
            {showRouteForm && (
              <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h4 className="text-xl font-semibold mb-4 text-gray-900">Route Planning</h4>
                
                {waypoints.map((wp, idx) => (
                  <div key={idx} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waypoint {idx + 1}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={wp.query}
                        onChange={(e) => {
                          const newWaypoints = [...waypoints];
                          newWaypoints[idx].query = e.target.value;
                          setWaypoints(newWaypoints);
                        }}
                        placeholder="Enter location..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {idx === 0 && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 -translate-x-6">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                      {idx === waypoints.length - 1 && idx > 0 && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 -translate-x-6">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Mode</label>
                    <select
                      value={routeMode}
                      onChange={(e) => setRouteMode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="car">🚗 Car</option>
                      <option value="foot">🚶 Walking</option>
                      <option value="bike">🚴 Cycling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Route Type</label>
                    <select
                      value={pathType}
                      onChange={(e) => setPathType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="shortest">⚡ Shortest Route</option>
                      <option value="safest">🛡️ Safest Route (UK only)</option>
                    </select>
                    {pathType === 'safest' && (
                      <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <strong>🛡️ Safety Analysis:</strong> Safest route fetches real crime data from multiple points along the route for comprehensive safety analysis. This may take 20-30 seconds.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCalculateRoute}
                    disabled={isCalculatingRoute}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                  >
                    {isCalculatingRoute ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="route-loading-message">
                          {pathType === 'safest' ? 'Calculating safest route...' : 'Calculating...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Calculate Route
                      </>
                    )}
                  </button>

                  {routeInfo && (
                    <button
                      onClick={handleSaveJourney}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                      </svg>
                      Save Journey
                    </button>
                  )}
                </div>

                {/* Route Information */}
                {routeInfo && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Route Information
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-gray-700">Distance: <strong>{routeInfo.distanceKm} km</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Duration: <strong>{routeInfo.durationMin} min</strong></span>
                      </div>
                      {routeInfo.riskScore !== null && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-gray-700">Risk Score: <strong>{routeInfo.riskScore}/100</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <MapView 
                center={mapCenter} 
                zoom={mapZoom} 
                markers={markers}
                route={route}
                crimeData={crimeData}
                height="500px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <section className="popular-countries mb-16">
        <h2 className="text-4xl font-bold text-center mb-4">Popular Countries</h2>
        <p className="text-center text-gray-600 mb-12">Explore safe travel destinations worldwide</p>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {(showAllCountries ? allCountries : defaultCountries).map((country, index) => (
              <Link key={index} to={`/country/${encodeURIComponent(country.name)}`} className="group cursor-pointer">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300 hover:border-blue-300">
                  <div className="text-3xl mb-2">{country.flag}</div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {country.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showAllCountries ? "Show less" : "Show all supported countries"}
            </button>
          </div>
        </div>
      </section>

      <section className="explore-cultures mb-16">
        <h2 className="text-4xl font-bold text-center mb-4">Explore Cultures</h2>
        <p className="text-center text-gray-600 mb-12">Discover diverse cultures and traditions from around the world</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((culture) => (
            <Link key={culture.id} to={`/culture/${culture.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={culture.image} 
                  alt={culture.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{culture.name}</h3>
                    <p className="text-sm opacity-90">{culture.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="popular-places mb-16">
        <h2 className="text-4xl font-bold text-center mb-4">Popular Places</h2>
        <p className="text-center text-gray-600 mb-12">Discover amazing destinations around the world</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPlaces.map((place) => (
            <Link key={place.id} to={`/place/${place.id}`} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
              <p className="text-sm text-gray-600">{place.location}</p>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
