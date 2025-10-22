import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Navigation, MapPin, Clock, AlertCircle, Route, Shield, Navigation2, Hotel } from 'lucide-react';
import DirectionsMap from './DirectionsMap';

export default function HotelDirectionsModal({ isOpen, onClose, hotel, userLocation }) {
  const [startingPoint, setStartingPoint] = useState('');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            { lat: hotel.lat, lng: hotel.lng }
          ],
          mode: 'car',
          pathType: 'shortest'
        })
      });

      const routeData = await routeResponse.json();

      if (!routeData.success) {
        throw new Error(routeData.error || 'Failed to get directions');
      }

      setDirections({
        ...routeData.route,
        startCoords: startCoords,
        endCoords: { lat: hotel.lat, lng: hotel.lng },
        startAddress: geocodeData[0].display_name,
        endAddress: hotel.name
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
  };

  const handleClose = () => {
    resetDirections();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        {/* Header with gradient background */}
        <DialogHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white -m-6 mb-0 p-6 rounded-t-xl">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Navigation2 className="h-6 w-6" />
            </div>
            <div>
              <div>Get Directions</div>
              <div className="text-sm font-normal text-purple-100 mt-1">to {hotel.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!directions ? (
          <div className="space-y-6 p-6">
            {/* Hotel Info Card */}
            <Card className="border-0 shadow-lg bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Hotel className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{hotel.name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {hotel.tags?.['addr:street'] && `${hotel.tags['addr:street']}, `}
                        {hotel.tags?.['addr:city'] || 'Location not specified'}
                      </p>
                      {hotel.tags?.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {hotel.tags.phone}
                        </p>
                      )}
                      {hotel.tags?.stars && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {hotel.tags.stars} stars
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
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Route className="h-5 w-5 text-purple-600" />
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
                      className="pl-10 h-12 border-gray-200 bg-white focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    disabled={!userLocation}
                    title="Use current location"
                    className="h-12 px-4 bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                
                {userLocation && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-purple-50 p-3 rounded-lg">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span>Your current location is available: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                  </div>
                )}
              </div>
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
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Route className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Route Summary</h3>
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
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-bold text-purple-600">{directions.durationMin} min</p>
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
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Navigation2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Interactive Route Map</h3>
                </div>
                <div className="rounded-xl overflow-hidden border-2 border-gray-100">
                  <DirectionsMap
                    startCoords={directions.startCoords}
                    endCoords={directions.endCoords}
                    routeGeometry={directions.geometry}
                    hospitalName={hotel.name}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <DialogFooter className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={resetDirections}
                className="h-12 px-6 bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
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