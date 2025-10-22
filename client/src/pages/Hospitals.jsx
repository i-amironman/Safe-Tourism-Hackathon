
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import HospitalCard from '../components/HospitalCard';
import Pagination from '../components/ui/pagination';
import { geocode } from '../lib/geocode';

// 20 hospital types for filtering
const HOSPITAL_TYPES = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'doctors', label: 'Doctor\'s Office' },
  { value: 'dentist', label: 'Dentist' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'alternative', label: 'Alternative Medicine' },
  { value: 'audiologist', label: 'Audiologist' },
  { value: 'blood_bank', label: 'Blood Bank' },
  { value: 'vaccination_centre', label: 'Vaccination Centre' },
  { value: 'midwife', label: 'Midwife' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'occupational_therapist', label: 'Occupational Therapist' },
  { value: 'optometrist', label: 'Optometrist' },
  { value: 'podiatrist', label: 'Podiatrist' },
  { value: 'psychotherapist', label: 'Psychotherapist' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'speech_therapist', label: 'Speech Therapist' },
  { value: 'dialysis', label: 'Dialysis Center' },
];

const ITEMS_PER_PAGE = 18;

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setHospitals([]);
    setCurrentPage(1);

    try {
      // First, geocode the location
      const location = await geocode(query);
      
      if (!location) {
        setError('Location not found. Please try a different search.');
        setIsLoading(false);
        return;
      }

      setUserLocation(location);

      // Fetch hospitals from our backend API
      const response = await fetch(
        `/places?lat=${location.lat}&lng=${location.lng}&type=hospital`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const data = await response.json();
      
      if (data.success) {
        setHospitals(data.places || []);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching for hospitals. Please try again.');
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

  // Filter hospitals based on selected types
  const filteredHospitals = selectedFilters.length > 0
    ? hospitals.filter(hospital => {
        const hospitalTypes = [
          hospital.tags.amenity,
          hospital.tags.healthcare,
        ].filter(Boolean);
        
        return selectedFilters.some(filter => 
          hospitalTypes.includes(filter)
        );
      })
    : hospitals;

  // Pagination logic
  const totalPages = Math.ceil(filteredHospitals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHospitals = filteredHospitals.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Centered Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Find Hospitals</h1>
          <p className="text-lg text-gray-600 mb-8">
            Search for hospitals and medical facilities in your destination
          </p>
        </div>
        
        {/* Centered Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for hospitals by location (e.g., 'New York', 'Tokyo')..." 
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for hospitals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && hospitals.length > 0 && (
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
                    <h3 className="font-semibold text-gray-900">Filter by Hospital Type</h3>
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
                    {HOSPITAL_TYPES.map(type => (
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
                Found <span className="font-semibold">{filteredHospitals.length}</span> hospital
                {filteredHospitals.length !== 1 ? 's' : ''} near{' '}
                <span className="font-semibold">{userLocation?.display_name}</span>
                {totalPages > 1 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>

            {/* Hospital Cards Grid */}
            {currentHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentHospitals.map(hospital => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    userLat={userLocation?.lat}
                    userLng={userLocation?.lng}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No hospitals match your selected filters.</p>
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
                  totalItems={filteredHospitals.length}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && hospitals.length === 0 && (
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
            <p className="text-gray-600 text-lg">Search for a location to find nearby hospitals</p>
          </div>
        )}
      </div>
    </div>
  );
}
