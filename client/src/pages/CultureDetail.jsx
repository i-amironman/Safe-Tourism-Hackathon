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
  Camera,
  BookOpen,
  Gift,
  Clock,
  Star,
  Heart,
  Globe,
  Mountain,
  Building,
  Train,
  DollarSign
} from 'lucide-react';

export default function CultureDetail() {
  const { cultureId } = useParams();
  const [culture, setCulture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCultureDetails();
  }, [cultureId]);

  const fetchCultureDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cultures/${cultureId}`);
      if (!response.ok) {
        throw new Error('Culture not found');
      }
      const data = await response.json();
      setCulture(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cultural information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
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

  if (!culture) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img 
          src={culture.image} 
          alt={culture.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-5xl font-bold mb-2">{culture.name}</h1>
            <p className="text-xl opacity-90 mb-4">{culture.description}</p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-white bg-white/20">
                <MapPin className="w-4 h-4 mr-1" />
                {culture.region}
              </Badge>
              <Badge variant="secondary" className="text-white bg-white/20">
                <Star className="w-4 h-4 mr-1" />
                Cultural Heritage
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cultural Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Cultural Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Introduction</h4>
                  <p className="text-gray-700 leading-relaxed">{culture.details.overview}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Historical Context</h4>
                  <p className="text-gray-700 leading-relaxed">{culture.details.history}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Philosophy & Values</h4>
                  <p className="text-gray-700 leading-relaxed">{culture.details.philosophy}</p>
                </div>
              </CardContent>
            </Card>

            {/* Traditions & Customs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Traditions & Customs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-blue-600" />
                    Traditional Clothing
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {culture.traditions.clothing.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">{item}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    Cuisine & Food Culture
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {culture.traditions.cuisine.map((dish, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-600" />
                    Arts & Entertainment
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {culture.traditions.arts.map((art, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">{art}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    Social Customs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {culture.traditions.customs.map((custom, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-50 text-green-800">{custom}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Festivals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-600" />
                  Cultural Festivals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {culture.festivals.map((festival, index) => (
                    <div key={index} className="border-l-4 border-pink-500 pl-4 bg-pink-50 p-4 rounded-r-lg">
                      <h5 className="font-semibold text-lg text-pink-800">{festival.name}</h5>
                      <p className="text-gray-700 mt-2">{festival.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-pink-600" />
                          <span className="text-sm font-medium text-pink-700">{festival.month}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{festival.significance}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Places */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-green-600" />
                  Cultural Places to Visit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {culture.places.map((place, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h5 className="font-semibold text-lg">{place.name}</h5>
                          <p className="text-sm opacity-90">{place.description}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {place.attractions.slice(0, 3).map((attraction, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {attraction}
                            </Badge>
                          ))}
                          {place.attractions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{place.attractions.length - 3} more
                            </Badge>
                          )}
                        </div>
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
                <CardTitle className="text-lg">Cultural Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Region: {culture.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Cultural Heritage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Living Traditions</span>
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
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Daily Lifestyle</h5>
                  <p className="text-sm text-gray-600">{culture.people.lifestyle}</p>
                </div>
                <Separator />
                <div>
                  <h5 className="font-medium mb-2">Core Values</h5>
                  <div className="space-y-1">
                    {culture.people.values.map((value, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h5 className="font-medium mb-2">Hospitality</h5>
                  <p className="text-sm text-gray-600">{culture.people.hospitality}</p>
                </div>
              </CardContent>
            </Card>

            {/* Cultural Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Experiences to Try
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Cultural Immersion</h5>
                  <p className="text-sm text-blue-700 mt-1">Participate in local festivals and ceremonies</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Culinary Experience</h5>
                  <p className="text-sm text-green-700 mt-1">Try traditional cuisine and cooking methods</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Arts & Crafts</h5>
                  <p className="text-sm text-purple-700 mt-1">Learn traditional arts and handicrafts</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Homestay Experience</h5>
                  <p className="text-sm text-orange-700 mt-1">Stay with local families for authentic experience</p>
                </div>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Cultural Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm">Respect local customs and traditions</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm">Learn basic phrases in local language</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm">Dress modestly when visiting religious sites</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm">Ask permission before photographing people</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm">Participate in community activities</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}