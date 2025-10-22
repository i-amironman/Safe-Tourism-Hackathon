import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Navigation, MapPin, Clock, AlertCircle, Route, Shield, Navigation2 } from 'lucide-react';
import DirectionsMap from './DirectionsMap';

export default function DirectionsModal({ isOpen, onClose, hospital, userLocation }) {
  const [startingPoint, setStartingPoint] = useState('');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeType, setRouteType] = useState('shortest'); // Add route type state

  const handleGetDirections = async () => {
    if (!startingPoint.trim()) {
      setError('Please enter a starting point');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, geocode the starting point
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startingPoint)}&limit=1`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
        throw new Error('Starting point not found. Please try a more specific location.');
      }

      const startCoords = {
        lat: parseFloat(geocodeData[0].lat),
        lng: parseFloat(geocodeData[0].lon)
      };

      // Get directions from our route API
      const routeResponse = await fetch('/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waypoints: [
            startCoords,
            { lat: hospital.lat, lng: hospital.lng }
          ],
          mode: 'car',
          pathType: routeType // Use selected route type
        })
      });

      const routeData = await routeResponse.json();

      if (!routeData.success) {
        throw new Error(routeData.error || 'Failed to get directions');
      }

      setDirections({
        ...routeData.route,
        startCoords: startCoords,
        endCoords: { lat: hospital.lat, lng: hospital.lng },
        startAddress: geocodeData[0].display_name,
        endAddress: hospital.name
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setStartingPoint(`${userLocation.lat}, ${userLocation.lng}`);
    } else {
      setError('Your current location is not available');
    }
  };

  const resetDirections = () => {
    setDirections(null);
    setError(null);
    setStartingPoint('');
    setRouteType('shortest'); // Reset route type
  };

  const handleClose = () => {
    resetDirections();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        {/* Header with gradient background */}
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white -m-6 mb-0 p-6 rounded-t-xl">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Navigation2 className="h-6 w-6" />
            </div>
            <div>
              <div>Get Directions</div>
              <div className="text-sm font-normal text-blue-100 mt-1">to {hospital.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!directions ? (
          <div className="space-y-6 p-6">
            {/* Hospital Info Card */}
            <Card className="border-0 shadow-lg bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{hospital.name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {hospital.tags?.['addr:street'] && `${hospital.tags['addr:street']}, `}
                        {hospital.tags?.['addr:city'] || 'Location not specified'}
                      </p>
                      {hospital.tags?.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {hospital.tags.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Starting Point Input Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Route className="h-5 w-5 text-blue-600" />
                </div>
                <label className="text-base font-semibold text-gray-900">Where are you starting from?</label>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Enter address, landmark, or coordinates"
                      value={startingPoint}
                      onChange={(e) => setStartingPoint(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGetDirections()}
                      className="pl-10 h-12 border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    disabled={!userLocation}
                    title="Use current location"
                    className="h-12 px-4 bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                
                {userLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Your current location is available: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Route Type Selection */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Route className="h-5 w-5 text-blue-600" />
                </div>
                <label className="text-base font-semibold text-gray-900">Route Preference</label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    routeType === 'shortest' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setRouteType('shortest')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      routeType === 'shortest' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {routeType === 'shortest' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Shortest Route</div>
                      <div className="text-sm text-gray-600">Fastest path</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    routeType === 'safest' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setRouteType('safest')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      routeType === 'safest' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {routeType === 'safest' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Safest Route</div>
                      <div className="text-sm text-gray-600">Low crime area</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {routeType === 'safest' && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">
                      Route calculated using real crime data for maximum safety
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <Card className="border-0 shadow-lg bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-red-700">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <DialogFooter className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="h-12 px-6 bg-white border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGetDirections} 
                disabled={loading || !startingPoint.trim()}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Getting Directions...
                  </>
                ) : (
                  <>
                    <Navigation className="h-5 w-5 mr-2" />
                    Get Directions
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Directions Results with Map */
          <div className="space-y-6 p-6">
            {/* Route Summary Card */}
            <Card className="border-0 shadow-lg bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${directions.pathType === 'safest' ? 'bg-green-500' : 'bg-blue-500'} p-2 rounded-lg`}>
                    <Route className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Route Summary</h3>
                    <p className="text-sm text-gray-600">
                      {directions.pathType === 'safest' ? 'Safest Route (Low Crime Area)' : 'Shortest Route (Fastest Path)'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">From</p>
                    <p className="font-medium text-sm text-gray-900">{directions.startAddress}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">To</p>
                    <p className="font-medium text-sm text-gray-900">{directions.endAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-bold text-blue-600">{directions.durationMin} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="font-bold text-green-600">{directions.distanceKm} km</p>
                    </div>
                  </div>
                  {directions.riskScore && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Safety Score</p>
                        <p className="font-bold text-purple-600">{100 - directions.riskScore}/100</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Map */}
            <Card className="border-0 shadow-lg bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Navigation2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Interactive Route Map</h3>
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-gray-100">
                  <DirectionsMap
                    startCoords={directions.startCoords}
                    endCoords={directions.endCoords}
                    routeGeometry={directions.geometry}
                    hospitalName={hospital.name}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <DialogFooter className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={resetDirections}
                className="h-12 px-6 bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <Navigation className="h-4 w-4 mr-2" />
                New Route
              </Button>
              <Button 
                onClick={handleClose}
                className="h-12 px-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}