import React, { useState } from 'react';
import { Map, Navigation, Search, Coffee, School, Store, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Sample data for places
const PLACES = [
  {
    id: 1,
    name: 'Main Library',
    category: 'academic',
    location: 'Central Campus',
    distance: '0.2 miles',
    description: 'The main library containing over 500,000 books and digital resources.',
    hours: '8:00 AM - 10:00 PM',
    image: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 2,
    name: 'Student Center',
    category: 'facility',
    location: 'North Campus',
    distance: '0.5 miles',
    description: 'A hub for student activities, meetings, and events.',
    hours: '7:00 AM - 11:00 PM',
    image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 3,
    name: 'Campus Café',
    category: 'food',
    location: 'West Campus',
    distance: '0.3 miles',
    description: 'Coffee, snacks, and light meals. Popular study spot.',
    hours: '7:30 AM - 8:00 PM',
    image: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 4,
    name: 'Science Building',
    category: 'academic',
    location: 'South Campus',
    distance: '0.7 miles',
    description: 'Houses the Chemistry, Physics, and Biology departments.',
    hours: '8:00 AM - 6:00 PM',
    image: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 5,
    name: 'University Bookstore',
    category: 'shopping',
    location: 'East Campus',
    distance: '0.4 miles',
    description: 'Textbooks, university merchandise, and school supplies.',
    hours: '9:00 AM - 5:00 PM',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 6,
    name: 'Recreation Center',
    category: 'facility',
    location: 'North Campus',
    distance: '0.6 miles',
    description: 'Gym, pool, courts, and fitness classes.',
    hours: '6:00 AM - 10:00 PM',
    image: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

// Filter categories
const CATEGORIES = [
  { id: 'all', label: 'All Places', icon: <Map size={20} /> },
  { id: 'academic', label: 'Academic', icon: <School size={20} /> },
  { id: 'food', label: 'Food & Dining', icon: <Coffee size={20} /> },
  { id: 'facility', label: 'Facilities', icon: <Home size={20} /> },
  { id: 'shopping', label: 'Shopping', icon: <Store size={20} /> },
];

const CampusNavigatorPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<typeof PLACES[0] | null>(null);

  // Filter places based on category and search query
  const filteredPlaces = PLACES.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Campus Navigator</h1>
          <p className="mt-2">Find places on and around campus</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
          <Search size={20} className="text-neutral-400 mr-2" />
          <input
            type="text"
            placeholder="Search for places..."
            className="flex-1 border-none outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-nowrap overflow-x-auto pb-2 -mx-2 hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`flex items-center px-4 py-2 rounded-full mx-2 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {selectedPlace ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden fade-in">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="p-4 flex items-center text-primary-600 hover:text-primary-800"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to places
            </button>
            
            <div className="relative h-64 md:h-96">
              <img 
                src={selectedPlace.image} 
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">{selectedPlace.name}</h1>
                  <p className="text-neutral-600 mt-1">{selectedPlace.location} • {selectedPlace.distance}</p>
                </div>
                <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm capitalize">
                  {selectedPlace.category}
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium">About</h2>
                <p className="mt-2 text-neutral-600">{selectedPlace.description}</p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium">Hours</h2>
                <p className="mt-2 text-neutral-600">{selectedPlace.hours}</p>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button className="btn-primary flex items-center">
                  <Navigation size={18} className="mr-2" />
                  Get Directions
                </button>
                <button className="btn-secondary">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map(place => (
                <div 
                  key={place.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="relative h-48">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs text-neutral-800">
                      {place.distance}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-neutral-900">{place.name}</h3>
                      <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs capitalize">
                        {place.category}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-sm mt-1">{place.location}</p>
                    <p className="text-neutral-600 mt-2 text-sm line-clamp-2">{place.description}</p>
                    <p className="text-neutral-500 text-sm mt-2">{place.hours}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-600">No places found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusNavigatorPage;