import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper function to generate crime bubbles
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
    
    // Calculate radius based on total crime count at this location - SAME AS CRIME PAGE
    // Base radius + scaling based on crime count
    let baseRadius = 50; // Minimum 50m radius - SAME AS CRIME PAGE
    let radius;
    
    if (dominantRiskLevel === 'High Risk') {
      radius = baseRadius + (totalCrimesAtLocation * 15); // 15m per crime for high risk - SAME AS CRIME PAGE
    } else if (dominantRiskLevel === 'Medium Risk') {
      radius = baseRadius + (totalCrimesAtLocation * 10); // 10m per crime for medium risk - SAME AS CRIME PAGE
    } else {
      radius = baseRadius + (totalCrimesAtLocation * 8); // 8m per crime for low risk - SAME AS CRIME PAGE
    }
    
    // Cap maximum radius - SAME AS CRIME PAGE
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

export default function DirectionsMap({ startCoords, endCoords, routeGeometry, hospitalName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [crimeData, setCrimeData] = useState([]);
  const [loadingCrimeData, setLoadingCrimeData] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !startCoords || !endCoords) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([
        (startCoords.lat + endCoords.lat) / 2,
        (startCoords.lng + endCoords.lng) / 2
      ], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      setMapReady(true);
    }

    return () => {
      // Cleanup map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, [startCoords, endCoords]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Create enhanced custom icons
    const startIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          position: relative;
          z-index: 1000;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          START
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      className: 'custom-start-marker',
      popupAnchor: [0, -44]
    });

    const endIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          position: relative;
          z-index: 1000;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${hospitalName ? 'HOSPITAL' : 'DESTINATION'}
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      className: 'custom-end-marker',
      popupAnchor: [0, -44]
    });

    // Add enhanced markers with detailed popups
    const startMarker = L.marker([startCoords.lat, startCoords.lng], { icon: startIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div style="
          font-family: Arial, sans-serif; 
          padding: 12px; 
          border-radius: 8px; 
          min-width: 200px;
          text-align: center;
        ">
          <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
          ">
            🚀 Starting Point
          </div>
          <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
            Your journey begins here
          </div>
          <div style="font-size: 12px; color: #666; font-style: italic;">
            Coordinates: ${startCoords.lat.toFixed(4)}, ${startCoords.lng.toFixed(4)}
          </div>
        </div>
      `);

    const endMarker = L.marker([endCoords.lat, endCoords.lng], { icon: endIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div style="
          font-family: Arial, sans-serif; 
          padding: 12px; 
          border-radius: 8px; 
          min-width: 200px;
          text-align: center;
        ">
          <div style="
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
          ">
            🏥 ${hospitalName || 'Destination'}
          </div>
          <div style="font-size: 14px; color: #333; margin-bottom: 4px;">
            Your journey ends here
          </div>
          <div style="font-size: 12px; color: #666; font-style: italic;">
            Coordinates: ${endCoords.lat.toFixed(4)}, ${endCoords.lng.toFixed(4)}
          </div>
        </div>
      `);

    // Add route polyline if available
    if (routeGeometry && routeGeometry.length > 0) {
      const routeCoordinates = routeGeometry.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
      
      L.polyline(routeCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(mapInstanceRef.current);

      // Fit map to show the entire route
      const bounds = L.latLngBounds(routeCoordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // If no route geometry, create a straight line and fit to both markers
      const bounds = L.latLngBounds([
        [startCoords.lat, startCoords.lng],
        [endCoords.lat, endCoords.lng]
      ]);
      
      // Draw straight line as fallback
      L.polyline([
        [startCoords.lat, startCoords.lng],
        [endCoords.lat, endCoords.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Open popup for the destination marker
    endMarker.openPopup();

    // Fetch and display crime data along the route
    fetchCrimeDataAlongRoute();

  }, [startCoords, endCoords, routeGeometry, hospitalName, mapReady]);

  // Function to fetch crime data along the route
  const fetchCrimeDataAlongRoute = async () => {
    if (!startCoords || !endCoords || !mapInstanceRef.current) return;
    
    setLoadingCrimeData(true);
    
    try {
      // Sample points along the route for crime data
      const samplePoints = [];
      
      if (routeGeometry && routeGeometry.length > 0) {
        // Sample every 8th point along the route to avoid too many API calls
        for (let i = 0; i < routeGeometry.length; i += 8) {
          samplePoints.push({
            lat: routeGeometry[i][1],
            lng: routeGeometry[i][0]
          });
        }
      } else {
        // If no route geometry, sample points along straight line
        const steps = 5;
        for (let i = 0; i <= steps; i++) {
          const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * (i / steps);
          const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * (i / steps);
          samplePoints.push({ lat, lng });
        }
      }
      
      // Fetch crime data for each sample point
      const crimePromises = samplePoints.map(async (point) => {
        try {
          const response = await fetch(
            `http://localhost:5000/crime?lat=${point.lat}&lng=${point.lng}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.crimeLocations) {
              return {
                centerLat: point.lat,
                centerLng: point.lng,
                bubbles: generateCrimeBubbles(data.byCategory, data.crimeLocations, point.lat, point.lng)
              };
            }
          }
        } catch (error) {
          console.warn('Failed to fetch crime data for point:', point, error);
        }
        return null;
      });
      
      const crimeResults = await Promise.all(crimePromises);
      const validCrimeData = crimeResults.filter(result => result !== null);
      
      // Combine all crime bubbles
      const allBubbles = [];
      validCrimeData.forEach(data => {
        if (data.bubbles && data.bubbles.length > 0) {
          allBubbles.push(...data.bubbles);
        }
      });
      
      setCrimeData(allBubbles);
      
    } catch (error) {
      console.error('Error fetching crime data along route:', error);
    } finally {
      setLoadingCrimeData(false);
    }
  };

  // Effect to render crime data on the map
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || crimeData.length === 0) return;

    // Clear existing crime layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Circle && layer.options.className === 'crime-circle') {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Render crime bubbles
    crimeData.forEach((crimeBubble, index) => {
      renderCrimeBubble(crimeBubble, `Route Area ${index + 1}`);
    });

  }, [crimeData, mapReady]);

  // Helper function to render individual crime bubbles - EXACT SAME AS CRIME PAGE
  const renderCrimeBubble = (crimeBubble, identifier) => {
    const { 
      lat, 
      lng, 
      category, 
      count, 
      categories,
      street_name,
      location_type,
      color, 
      fillColor, 
      radius, 
      riskLevel,
      categoryBreakdown
    } = crimeBubble;
    
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      // Determine if this is high risk for styling - SAME AS CRIME PAGE
      const isHighRisk = riskLevel === 'High Risk';
      const isMediumRisk = riskLevel === 'Medium Risk';
      
      // Create circle for crime visualization - EXACT SAME AS CRIME PAGE
      const circle = L.circle([lat, lng], {
        color: color,
        fillColor: fillColor,
        fillOpacity: 0.2,
        radius: radius,
        weight: isHighRisk ? 3 : 2,
        className: isHighRisk ? 'crime-circle crime-circle-high-risk' : 'crime-circle',
        dashArray: isHighRisk ? '10, 5' : null,
        dashOffset: '0'
      });
      
      // Add popup with detailed crime information - EXACT SAME AS CRIME PAGE
      const popupContent = `
        <div style="
          text-align: center; 
          font-family: Arial, sans-serif; 
          min-width: 220px;
          padding: 12px;
          border-radius: 6px;
        ">
          <div style="
            background-color: ${color};
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">
            ${riskLevel}
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 4px;">
            ${category}
          </div>
          <div style="font-size: 18px; font-weight: bold; color: ${color}; margin-bottom: 6px;">
            ${count} incidents
          </div>
          <div style="font-size: 11px; color: #666; margin-bottom: 6px; font-style: italic;">
            📍 ${street_name}
          </div>
          <div style="
            font-size: 10px;
            color: #888;
            background-color: #f5f5f5;
            padding: 6px;
            border-radius: 3px;
            margin-bottom: 8px;
            text-align: left;
          ">
            <strong>Breakdown:</strong><br>
            ${categoryBreakdown}
          </div>
          <div style="
            font-size: 10px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 6px;
            margin-top: 6px;
            line-height: 1.3;
          ">
            ${isHighRisk ? '⚠️ High crime area - exercise extreme caution' : 
              isMediumRisk ? '⚡ Moderate crime area - stay alert and aware' : 
              '✅ Low crime area - relatively safe but remain vigilant'}
          </div>
        </div>
      `;
      circle.bindPopup(popupContent);
      
      // Add tooltip with summary - SAME AS CRIME PAGE
      circle.bindTooltip(`${street_name}: ${count} incidents`, {
        permanent: false,
        direction: 'center',
        className: 'crime-tooltip',
        offset: [0, 0]
      });
      
      circle.addTo(mapInstanceRef.current);
    }
  };

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 shadow-lg border border-gray-200">
        <div className="font-semibold text-gray-800 mb-2">Route Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="font-medium text-green-700">Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="font-medium text-red-700">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span className="font-medium text-blue-700">Route</span>
          </div>
        </div>
        
        {crimeData.length > 0 && (
          <>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="font-semibold text-gray-800 mb-2">Crime Risk Areas</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
                  <span className="text-yellow-700">Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full opacity-60"></div>
                  <span className="text-orange-700">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
                  <span className="text-red-700">High Risk</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 italic">
              Same format as Crime Data page
            </div>
          </>
        )}
        
        {loadingCrimeData && (
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
              <span>Loading crime data...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}