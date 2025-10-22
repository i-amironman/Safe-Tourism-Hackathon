
import { useState, useEffect } from 'react';
import HotelDirectionsModal from './HotelDirectionsModal';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HotelCard({ hotel, userLat, userLng }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const distance = userLat && userLng 
    ? haversineDistance(userLat, userLng, hotel.lat, hotel.lng)
    : null;

  const getHotelType = (tags) => {
    const types = [];
    if (tags.tourism) types.push(tags.tourism);
    if (tags.amenity) types.push(tags.amenity);
    return types.length > 0 ? types : ['accommodation'];
  };

  const types = getHotelType(hotel.tags);

  // Fetch hotel image using our backend API
  const fetchHotelImage = async () => {
    if (!hotel.name) {
      setCurrentImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80');
      setImageLoading(false);
      return;
    }

    try {
      setImageLoading(true);
      const hotelType = hotel.tags?.tourism || hotel.tags?.amenity || 'hotel';
      
      const response = await fetch(
        `/api/hotel-images/search?hotelName=${encodeURIComponent(hotel.name)}&hotelType=${encodeURIComponent(hotelType)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.imageUrl) {
          setCurrentImageUrl(data.imageUrl);
          console.log(`Hotel image loaded for ${hotel.name}: ${data.imageUrl}`);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to fetch hotel image:', error);
    }
    
    // Fallback to default image
    setCurrentImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80');
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageLoading(false);
  };

  const handleImageError = () => {
    // Use fallback image if current image fails
    setCurrentImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80');
    setImageLoading(false);
  };

  // Initialize image loading when component mounts or hotel changes
  useEffect(() => {
    setImageLoaded(false);
    setImageLoading(true);
    setCurrentImageUrl(null);
    
    fetchHotelImage();
  }, [hotel.id, hotel.name]);

  const handleGetDirections = () => {
    setIsDirectionsOpen(true);
  };

  const userLocation = userLat && userLng ? { lat: userLat, lng: userLng } : null;

  // Reset image loaded state when hotel changes
  useEffect(() => {
    setImageLoaded(false);
  }, [hotel.id, hotel.name]);

  const handleAddToFavorites = async () => {
    setIsAddingFavorite(true);
    try {
      const response = await fetch('http://localhost:5000/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          place: {
            name: hotel.name || 'Unnamed Hotel',
            latitude: hotel.lat,
            longitude: hotel.lng,
            tags: hotel.tags,
          }
        }),
      });

      if (response.status === 401) {
        alert('Please log in to add favorites');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }

      setIsFavorite(true);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error);
      alert('Failed to add favorite. Please try again.');
    } finally {
      setIsAddingFavorite(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Hotel Image */}
      <div className="w-full h-48 relative bg-gray-100">
        {currentImageUrl && (
          <img 
            src={currentImageUrl}
            alt={`${hotel.name} - Hotel Building`}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? '1' : '0', transition: 'opacity 0.3s ease' }}
          />
        )}
        <div className="absolute top-2 right-2">
          {/* Hotel Icon */}
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg 
              className="w-4 h-4 text-purple-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {hotel.name || 'Unnamed Hotel'}
          </h3>
          {distance !== null && (
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full ml-2">
              {distance < 1 
                ? `${(distance * 1000).toFixed(0)}m` 
                : `${distance.toFixed(2)}km`}
            </span>
          )}
        </div>

        {/* Type Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {types.map((type, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
            >
              {type.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Star Rating */}
        {hotel.tags.stars && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{hotel.tags.stars} stars</span>
          </div>
        )}

        {/* Additional Info */}
        {hotel.tags.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{hotel.tags.phone}</span>
          </div>
        )}

        {hotel.tags.website && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a 
              href={hotel.tags.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleGetDirections}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
              />
            </svg>
            Get Directions
          </button>
          
          <button
            onClick={handleAddToFavorites}
            disabled={isFavorite || isAddingFavorite}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isFavorite 
                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <svg 
              className="w-4 h-4" 
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            {isFavorite ? 'Favorited' : isAddingFavorite ? 'Adding...' : 'Favorite'}
          </button>
        </div>
      </div>

      {/* Directions Modal */}
      <HotelDirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
        hotel={hotel}
        userLocation={userLocation}
      />
    </div>
  );
}
