
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/ui/pagination';
import { geocode } from '../lib/geocode';

// Hotel amenity types for filtering
const HOTEL_AMENITIES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'motel', label: 'Motel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'guest_house', label: 'Guest House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'chalet', label: 'Chalet' },
  { value: 'resort', label: 'Resort' },
  { value: 'bed_and_breakfast', label: 'B&B' },
  { value: 'camping', label: 'Camping' },
  { value: 'caravan_site', label: 'Caravan Site' },
];

const ITEMS_PER_PAGE = 18;

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setHotels([]);
    setCurrentPage(1);

    try {
      const location = await geocode(query);
      
      if (!location) {
        setError('Location not found. Please try a different search.');
        setIsLoading(false);
        return;
      }

      setUserLocation(location);

      const response = await fetch(
        `http://localhost:5000/places?lat=${location.lat}&lng=${location.lng}&type=hotel`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      
      if (data.success) {
        setHotels(data.places || []);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching for hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filterValue) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterValue)) {
        return prev.filter(f => f !== filterValue);
      } else {
        return [...prev, filterValue];
      }
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  const filteredHotels = selectedFilters.length > 0
    ? hotels.filter(hotel => {
        const hotelTypes = [
          hotel.tags.tourism,
          hotel.tags.amenity,
        ].filter(Boolean);
        
        return selectedFilters.some(filter => 
          hotelTypes.includes(filter)
        );
      })
    : hotels;

  // Pagination logic
  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHotels = filteredHotels.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Centered Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Find Safe Hotels</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover hotels in safe neighborhoods with high security ratings
          </p>
        </div>
        
        {/* Centered Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for hotels by location (e.g., 'Paris', 'Rome')..." 
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for hotels...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && hotels.length > 0 && (
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="text-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Type ({selectedFilters.length})
              </button>

              {showFilters && (
                <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 text-left">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Filter by Hotel Type</h3>
                    {selectedFilters.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {HOTEL_AMENITIES.map(type => (
                      <label
                        key={type.value}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(type.value)}
                          onChange={() => toggleFilter(type.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="text-center">
              <p className="text-gray-700">
                Found <span className="font-semibold">{filteredHotels.length}</span> hotel
                {filteredHotels.length !== 1 ? 's' : ''} near{' '}
                <span className="font-semibold">{userLocation?.display_name}</span>
                {totalPages > 1 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>

            {/* Hotel Cards Grid */}
            {currentHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentHotels.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    userLat={userLocation?.lat}
                    userLng={userLocation?.lng}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No hotels match your selected filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredHotels.length}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && hotels.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <p className="text-gray-600 text-lg">Search for a location to find nearby hotels</p>
          </div>
        )}
      </div>
    </div>
  );
}
