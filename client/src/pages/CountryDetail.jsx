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
  Globe,
  Heart,
  Camera,
  BookOpen,
  Gift
} from 'lucide-react';

export default function CountryDetail() {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountryDetails();
  }, [countryName]);

  const fetchCountryDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/countries/${encodeURIComponent(countryName)}`);
      if (!response.ok) {
        throw new Error('Country not found');
      }
      const data = await response.json();
      setCountry(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading country information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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

  if (!country) return null;

  const { tourism } = country;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={country.flags?.svg} 
                alt={`${country.name?.common} flag`} 
                className="w-24 h-16 object-cover rounded-lg shadow-2xl border-4 border-white"
              />
            </div>
            <h1 className="text-5xl font-bold mb-2">{country.name?.common}</h1>
            <p className="text-xl opacity-90">{country.name?.official}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="secondary" className="text-white bg-white/20">
                <MapPin className="w-4 h-4 mr-1" />
                {country.region}
              </Badge>
              <Badge variant="secondary" className="text-white bg-white/20">
                <Globe className="w-4 h-4 mr-1" />
                {country.subregion}
              </Badge>
              <Badge variant="secondary" className="text-white bg-white/20">
                <Users className="w-4 h-4 mr-1" />
                {country.population?.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tourism Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Tourism Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {tourism?.tourism?.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Best Time:</span>
                    <Badge variant="outline">{tourism?.tourism?.bestTimeToVisit}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Popular Destination</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Popular Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tourism?.tourism?.popularActivities?.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Culture Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Culture & Traditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-gray-700">{tourism?.culture?.overview}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {tourism?.culture?.languages?.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Traditional Clothing</h4>
                  <div className="flex flex-wrap gap-2">
                    {tourism?.culture?.traditions?.clothing?.map((item, index) => (
                      <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cuisine</h4>
                  <div className="flex flex-wrap gap-2">
                    {tourism?.culture?.traditions?.cuisine?.map((dish, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-800">{dish}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Festivals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-600" />
                  Festivals & Celebrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tourism?.culture?.festivals?.map((festival, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-semibold text-lg">{festival.name}</h5>
                      <p className="text-gray-600 text-sm mt-1">{festival.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{festival.month}</span>
                      </div>
                    </div>
                  ))}
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
                  <span className="text-sm">Capital: {country.capital?.[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Population: {country.population?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Area: {country.area?.toLocaleString()} km²</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Currency: {Object.values(country.currencies || {})[0]?.name}</span>
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  Transportation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-gray-500" />
                    International
                  </h5>
                  <p className="text-sm text-gray-600">{tourism?.tourism?.transportation?.international}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Train className="w-4 h-4 text-gray-500" />
                    Domestic
                  </h5>
                  <p className="text-sm text-gray-600">{tourism?.tourism?.transportation?.domestic}</p>
                </div>
              </CardContent>
            </Card>

            {/* Accommodation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-600" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium text-green-700">Budget</h5>
                  <p className="text-sm text-gray-600">{tourism?.tourism?.accommodation?.budget}</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700">Mid-Range</h5>
                  <p className="text-sm text-gray-600">{tourism?.tourism?.accommodation?.midRange}</p>
                </div>
                <div>
                  <h5 className="font-medium text-purple-700">Luxury</h5>
                  <p className="text-sm text-gray-600">{tourism?.tourism?.accommodation?.luxury}</p>
                </div>
              </CardContent>
            </Card>

            {/* People & Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  People & Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium mb-2">Lifestyle</h5>
                  <p className="text-sm text-gray-600">{tourism?.people?.lifestyle}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Hospitality</h5>
                  <p className="text-sm text-gray-600">{tourism?.people?.hospitality}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Social Customs</h5>
                  <div className="space-y-1">
                    {tourism?.people?.socialCustoms?.map((custom, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{custom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}