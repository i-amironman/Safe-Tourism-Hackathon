
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MapView from '../components/MapView';
import { geocode } from '../lib/geocode';

export default function Crime() {
  const [crimeData, setCrimeData] = useState(null);
  const [crimeBubbles, setCrimeBubbles] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setCrimeData(null);
    setCrimeBubbles([]);

    try {
      const location = await geocode(query);
      
      if (!location) {
        setError('Location not found. Please try a different search.');
        setIsLoading(false);
        return;
      }

      setMapCenter([location.lat, location.lng]);
      setMapZoom(14);

      // Fetch crime data
      const response = await fetch(
        `http://localhost:5000/crime?lat=${location.lat}&lng=${location.lng}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch crime data');
      }

      const data = await response.json();
      
      if (data.success) {
        setCrimeData(data);
        
        // Generate crime bubbles based on actual crime locations and counts
        const crimeBubbles = generateCrimeBubbles(data.byCategory, data.crimeLocations, location.lat, location.lng);
        
        // Create heatmap effect with semi-transparent circle marker
        setMarkers([{
          lat: location.lat,
          lng: location.lng,
          label: `${location.display_name}<br/>Crime Score: ${data.crimeScore}/100<br/>Total Crimes: ${data.total}`
        }]);
        
        // Set crime data for map visualization
        setCrimeBubbles(crimeBubbles);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while fetching crime data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCrimeScoreColor = (score) => {
    if (score <= 15) return 'text-green-600 bg-green-50';
    if (score <= 35) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCrimeScoreLabel = (score) => {
    if (score <= 15) return 'Low Risk';
    if (score <= 35) return 'Moderate Risk';
    return 'High Risk';
  };

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
      // Base radius + scaling based on crime count
      let baseRadius = 50; // Minimum 50m radius
      let radius;
      
      if (dominantRiskLevel === 'High Risk') {
        radius = baseRadius + (totalCrimesAtLocation * 15); // 15m per crime for high risk
      } else if (dominantRiskLevel === 'Medium Risk') {
        radius = baseRadius + (totalCrimesAtLocation * 10); // 10m per crime for medium risk
      } else {
        radius = baseRadius + (totalCrimesAtLocation * 8); // 8m per crime for low risk
      }
      
      // Cap maximum radius
      radius = Math.min(radius, 300);
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Centered Crime Statistics Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-6">Crime Statistics</h1>
        <p className="text-lg text-gray-600 mb-6">
          View real-time crime data and safety ratings for any location
        </p>
      </div>
      
      {/* Centered Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for crime data by location..." 
        />
      </div>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Fetching crime data...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {crimeData && !isLoading && (
        <div className="mt-8">
          {/* Coverage Notice */}
          {crimeData.coverage === 'uk_only' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Coverage Information</h3>
              <p className="text-blue-800 text-sm">{crimeData.message}</p>
            </div>
          )}

          {/* Crime Score Card */}
          <div className={`mb-6 p-6 rounded-lg border-2 ${getCrimeScoreColor(crimeData.crimeScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Crime Score: {crimeData.crimeScore}/100
                </h2>
                <p className="text-lg font-semibold">
                  {getCrimeScoreLabel(crimeData.crimeScore)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Tourist-friendly score adjusted for historical data context
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{crimeData.total}</p>
                <p className="text-sm">Total Crimes</p>
              </div>
            </div>
            {crimeData.lastUpdated && (
              <p className="mt-3 text-sm">
                Last Updated: {new Date(crimeData.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Crime Score Explanation */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🛡️ Understanding the Crime Score</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>Our tourist-friendly crime score uses a smart scaling system to provide realistic safety assessments:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="font-semibold text-green-700">0-15: Low Risk</div>
                  <div className="text-xs text-gray-600">Most tourist areas, generally safe</div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="font-semibold text-yellow-700">16-35: Moderate Risk</div>
                  <div className="text-xs text-gray-600">Normal urban precautions advised</div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <div className="font-semibold text-red-700">36-50: High Risk</div>
                  <div className="text-xs text-gray-600">Extra vigilance recommended</div>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                <strong>Note:</strong> Scores are adjusted for historical data context and may not reflect current conditions. 
                Always exercise normal travel precautions and check local advisories.
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Location Map</h3>
            <MapView 
              center={mapCenter} 
              zoom={mapZoom} 
              markers={markers}
              crimeData={crimeBubbles}
              height="400px"
            />
          </div>

          {/* Crime Categories */}
          {Object.keys(crimeData.byCategory).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Crime by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(crimeData.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div 
                      key={category}
                      className="p-4 bg-white border border-gray-200 rounded-lg"
                    >
                      <p className="text-sm text-gray-600 capitalize">
                        {category.replace(/-/g, ' ')}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Limitations */}
          {crimeData.limitations && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Data Limitations</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {crimeData.limitations.map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && !crimeData && (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
          <p className="text-gray-600">Search for a location to view crime statistics</p>
        </div>
      )}
    </div>
  );
}
