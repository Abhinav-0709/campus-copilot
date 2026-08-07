import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Coffee, 
  Building, 
  School,
  Library,
  Home,
  Utensils,
  LandPlot,
  Navigation
} from 'lucide-react';

interface Place {
  id: number;
  name: string;
  type: 'building' | 'cafe' | 'library' | 'lab' | 'dorm' | 'restaurant' | 'landmark';
  location: string;
  distance: string;
  description: string;
  image?: string;
}

const CampusNavigator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const places: Place[] = [
    {
      id: 1,
      name: 'A.P.J Abdul Kalam Block',
      type: 'building',
      location: 'Main Academic Building',
      distance: '0.2 km',
      description: 'Houses the administration offices, lecture halls, and faculty offices for the Schools of Business and Humanities.',
      image: '/images/a.jpg'
    },
    {
      id: 2,
      name: 'Boys hostel',
      type: 'building',
      location: 'Bhagirathi Bhavan',
      distance: '0.5 km',
      description: 'A Vibrant and secure living space designed for comfort. our hostel offers spacious rooms with all morden amenities needed for smooth life.',
      image: '/images/hostel.jpg'
    },
    {
      id: 3,
      name: 'Marigold Café',
      type: 'cafe',
      location: 'Student Center',
      distance: '0.3 km',
      description: 'Popular spot for coffee, light meals, and study sessions. Features indoor and outdoor seating areas.',
      image: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 4,
      name: 'College Library',
      type: 'library',
      location: 'C Block',
      distance: '0.2 km',
      description: 'Five-story library with extensive collections, study rooms, computer labs, and multimedia resources.',
      image: '/images/lib.jpg'
    },
    {
      id: 5,
      name: 'Computer Science Lab',
      type: 'lab',
      location: 'C.V Raman ,B Block',
      distance: '0.6 km',
      description: 'Advanced computing lab with specialized hardware for AI, machine learning, and software development projects.',
      image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 6,
      name: 'College auditorium',
      type: 'landmark',
      location: 'A Block',
      distance: '0.8 km',
      description: 'Step into a world of creativity and insprition at our state-of-art auditorium.Desined to host everything from captivating performance.',
      image: '/images/aud.jpg'
    },
    {
      id: 7,
      name: 'Boys Bostel Mess',
      type: 'restaurant',
      location: 'Bhagirathi Bhavan',
      distance: '0.3 km',
      description: 'Full-service restaurant offering a variety of meals, from burgers and sandwiches to healthy options and international cuisine.',
      image: '/images/mess.jpg'
    },
    {
      id: 8,
      name: 'Rit cricket Ground',
      type: 'landmark',
      location: ' Near Boys Hostel',
      distance: '0.1 km',
      description: 'Historic quadrangle surrounded by the original campus buildings, featuring gardens and college ground.',
      image: '/images/ground.jpg'
    },
  ];


  const getIcon = (type: string) => {
    switch (type) {
      case 'building':
        return <Building className="h-5 w-5" />;
      case 'cafe':
        return <Coffee className="h-5 w-5" />;
      case 'library':
        return <Library className="h-5 w-5" />;
      case 'lab':
        return <School className="h-5 w-5" />;
      case 'dorm':
        return <Home className="h-5 w-5" />;
      case 'restaurant':
        return <Utensils className="h-5 w-5" />;
      case 'landmark':
        return <LandPlot className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const filterTypes = [
    { name: 'All', value: null },
    { name: 'Buildings', value: 'building' },
    { name: 'Cafes', value: 'cafe' },
    { name: 'Libraries', value: 'library' },
    { name: 'Labs', value: 'lab' },
    { name: 'Dormitories', value: 'dorm' },
    { name: 'Restaurants', value: 'restaurant' },
    { name: 'Landmarks', value: 'landmark' },
  ];

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter ? place.type === activeFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campus Navigator</h1>
        <p className="text-gray-600">Explore campus locations and find your way around</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Search and filters */}
        <div className="lg:col-span-1">
          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 font-medium text-gray-900">Filter by Type</h2>
            <div className="flex flex-wrap gap-2">
              {filterTypes.map((filter) => (
                <button
                  key={filter.name}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    activeFilter === filter.value 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="font-medium text-gray-900">Places ({filteredPlaces.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    className={`block w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      selectedPlace?.id === place.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <div className="flex items-start">
                      <div className={`rounded-full p-2 ${
                        selectedPlace?.id === place.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getIcon(place.type)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{place.name}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-4 w-4" />
                          {place.location}
                          <span className="mx-2">•</span>
                          {place.distance}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No places found matching your criteria
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map and Place Details */}
        <div className="lg:col-span-2">
          {selectedPlace ? (
            <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
              {selectedPlace.image && (
                <div className="relative h-56 w-full">
                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{selectedPlace.name}</h2>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800 capitalize">
                    {getIcon(selectedPlace.type)}
                    <span className="ml-1">{selectedPlace.type}</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="mr-1 h-4 w-4" />
                  {selectedPlace.location}
                  <span className="mx-2">•</span>
                  {selectedPlace.distance} from your location
                </div>
                <p className="mt-4 text-gray-700">{selectedPlace.description}</p>
                <div className="mt-6 flex space-x-3">
                  <button className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </button>
                  <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Save to Favorites
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-white p-6 shadow text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select a location</h3>
              <p className="mt-1 text-gray-500">
                Choose a place from the list to view details and get directions
              </p>
            </div>
          )}

          {/* Campus Map */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-3">
              <h2 className="font-medium text-gray-900">Campus Map</h2>
            </div>
            <div className="p-2">
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src="/images/map.jpg"
                  alt="Campus Map"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white">
                  <div className="text-center">
                    <p className="text-lg font-semibold">Interactive Map Coming Soon</p>
                    <p className="mt-2 text-sm">We're working on an interactive campus map experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusNavigator;