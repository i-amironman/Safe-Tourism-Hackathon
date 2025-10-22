import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Utensils, 
  Shirt, 
  Music,
  Home,
  Plane,
  Train,
  Car,
  DollarSign,
  Clock,
  Star,
  Heart,
  Camera,
  BookOpen,
  Gift,
  Mountain,
  Building,
  Hotel,
  Coffee,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function PlaceDetail() {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/popular-places/${placeId}`);
      if (!response.ok) {
        throw new Error('Place not found');
      }
      const data = await response.json();
      setPlace(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading place information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img 
          src={place.image} 
          alt={place.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-5xl font-bold mb-2">{place.name}</h1>
            <p className="text-xl opacity-90 mb-4">{place.description}</p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-white bg-white/20">
                <MapPin className="w-4 h-4 mr-1" />
                {place.region}, {place.country}
              </Badge>
              <Badge variant="secondary" className="text-white bg-white/20">
                <Star className="w-4 h-4 mr-1" />
                {place.rating} ⭐
              </Badge>
              <Badge variant="secondary" className="text-white bg-white/20">
                <Calendar className="w-4 h-4 mr-1" />
                {place.bestTimeToVisit}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Place Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  About {place.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-gray-700 leading-relaxed">{place.details.overview}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-green-600" />
                      Geography
                    </h5>
                    <p className="text-sm text-gray-600">{place.details.geography}</p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      Climate
                    </h5>
                    <p className="text-sm text-gray-600">{place.details.climate}</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-blue-600" />
                    Accessibility
                  </h5>
                  <p className="text-sm text-gray-600">{place.details.accessibility}</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Attractions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-red-500" />
                  Top Attractions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {place.attractions.map((attraction, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={attraction.image} 
                          alt={attraction.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h5 className="font-semibold text-lg">{attraction.name}</h5>
                          <p className="text-sm opacity-90">{attraction.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{attraction.timing}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{attraction.entryFee}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {attraction.activities.map((activity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Popular Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {place.activities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-pink-500 pl-4 bg-pink-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg text-pink-800">{activity.name}</h5>
                          <p className="text-gray-700 mt-2">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-pink-600" />
                              <span className="text-sm font-medium text-pink-700">{activity.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-pink-600" />
                              <span className="text-sm font-medium text-pink-700">{activity.cost}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-pink-600" />
                              <span className="text-sm text-gray-600">{activity.bestSeason}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Local Cuisine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-600" />
                  Local Cuisine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Must-Try Local Specialties</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {place.cuisine.localSpecialties.map((specialty, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-orange-800">{specialty.name}</h5>
                          <p className="text-sm text-gray-600">{specialty.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          {specialty.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">Popular Restaurants</h4>
                  <div className="space-y-3">
                    {place.cuisine.popularRestaurants.map((restaurant, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{restaurant.name}</h5>
                            <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.priceRange}</p>
                            <p className="text-sm text-orange-600 mt-1">Specialty: {restaurant.specialty}</p>
                          </div>
                          <Badge variant="outline">Popular</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{place.region}, {place.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Rating: {place.rating} ⭐</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Best Time: {place.bestTimeToVisit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Category: {place.category}</span>
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Getting There & Around
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-gray-500" />
                    Nearest Airport
                  </h5>
                  <p className="text-sm text-gray-600">{place.transportation.nearestAirport}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Train className="w-4 h-4 text-gray-500" />
                    Railway Connectivity
                  </h5>
                  <p className="text-sm text-gray-600">{place.transportation.railwayConnectivity}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    Road Connectivity
                  </h5>
                  <p className="text-sm text-gray-600">{place.transportation.roadConnectivity}</p>
                </div>
                <Separator />
                <div>
                  <h5 className="font-medium mb-2">Getting Around</h5>
                  <div className="flex flex-wrap gap-2">
                    {place.transportation.gettingAround.map((mode, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-green-600" />
                  Where to Stay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Budget Options</h5>
                  <div className="space-y-2">
                    {place.accommodation.budget.map((hotel, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded">
                        <h6 className="text-sm font-medium">{hotel.name}</h6>
                        <p className="text-xs text-gray-600">{hotel.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">Mid-Range</h5>
                  <div className="space-y-2">
                    {place.accommodation.midRange.map((hotel, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded">
                        <h6 className="text-sm font-medium">{hotel.name}</h6>
                        <p className="text-xs text-gray-600">{hotel.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-purple-700 mb-2">Luxury</h5>
                  <div className="space-y-2">
                    {place.accommodation.luxury.map((hotel, index) => (
                      <div key={index} className="p-2 bg-purple-50 rounded">
                        <h6 className="text-sm font-medium">{hotel.name}</h6>
                        <p className="text-xs text-gray-600">{hotel.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {place.travelTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Book Now CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <CardContent className="text-center p-6">
                <h3 className="text-xl font-bold mb-2">Ready to Visit?</h3>
                <p className="text-sm opacity-90 mb-4">Plan your trip to {place.name}</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Planning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}