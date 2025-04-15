import React, { useState } from 'react';
import { MapPinIcon, ArrowsPointingOutIcon, ListBulletIcon } from '@heroicons/react/24/outline';

// Mock disposal locations data
const mockLocations = [
  {
    id: 1,
    name: 'UW Recycling Center',
    address: '4100 University Way NE, Seattle, WA 98105',
    category: 'recycling',
    acceptedItems: ['Paper', 'Plastic', 'Glass', 'Metal', 'Electronics'],
    hours: 'Mon-Fri: 8am-5pm, Sat: 10am-4pm',
    distance: 0.3
  },
  {
    id: 2,
    name: 'Campus Compost Station',
    address: 'Red Square, University of Washington',
    category: 'compost',
    acceptedItems: ['Food waste', 'Paper towels', 'Plant debris'],
    hours: 'Mon-Sun: 24 hours',
    distance: 0.5
  },
  {
    id: 3,
    name: 'HUB Waste Collection',
    address: 'Husky Union Building, UW Campus',
    category: 'general',
    acceptedItems: ['General waste', 'Recyclables', 'Compost'],
    hours: 'Mon-Fri: 7am-10pm, Sat-Sun: 8am-8pm',
    distance: 0.8
  },
  {
    id: 4,
    name: 'E-Waste Drop-off Center',
    address: '4200 Mary Gates Memorial Dr NE, Seattle, WA 98195',
    category: 'electronic',
    acceptedItems: ['Computers', 'Phones', 'Batteries', 'Printers'],
    hours: 'Mon, Wed, Fri: 9am-3pm',
    distance: 1.2
  },
  {
    id: 5,
    name: 'Hazardous Waste Facility',
    address: '3900 Mason Road, Seattle, WA 98195',
    category: 'hazardous',
    acceptedItems: ['Chemicals', 'Paint', 'Oil', 'Cleaning supplies'],
    hours: 'Tue, Thu: 10am-2pm',
    distance: 1.5
  }
];

// Category icons and colors
const categoryConfig = {
  recycling: { color: 'bg-blue-100 text-blue-800', label: 'Recycling' },
  compost: { color: 'bg-green-100 text-green-800', label: 'Compost' },
  general: { color: 'bg-gray-100 text-gray-800', label: 'General Waste' },
  electronic: { color: 'bg-yellow-100 text-yellow-800', label: 'E-Waste' },
  hazardous: { color: 'bg-red-100 text-red-800', label: 'Hazardous Waste' }
};

const LocationCard = ({ location }) => {
  const [expanded, setExpanded] = useState(false);
  const categoryStyle = categoryConfig[location.category].color;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{location.address}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryStyle}`}>
              {categoryConfig[location.category].label}
            </span>
          </div>
          <div className="text-right">
            <span className="text-green-700 font-bold">{location.distance} mi</span>
            <p className="text-xs text-gray-500">from your location</p>
          </div>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-green-700 hover:text-green-800 focus:outline-none flex items-center"
        >
          {expanded ? 'Show less' : 'Show details'}
          <svg 
            className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">Hours</p>
            <p className="text-sm text-gray-600">{location.hours}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Accepted Items</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {location.acceptedItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button className="flex items-center justify-center px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800">
              <MapPinIcon className="h-4 w-4 mr-1" />
              Directions
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DisposalLocations = () => {
  const [viewType, setViewType] = useState('list'); // 'list' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredLocations = selectedCategory === 'all'
    ? mockLocations
    : mockLocations.filter(location => location.category === selectedCategory);
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'recycling', label: 'Recycling' },
    { id: 'compost', label: 'Compost' },
    { id: 'general', label: 'General' },
    { id: 'electronic', label: 'E-Waste' },
    { id: 'hazardous', label: 'Hazardous' }
  ];
  
  return (
    <div className="container mx-auto px-4 pt-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Disposal Locations</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md ${viewType === 'list' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setViewType('map')}
            className={`p-2 rounded-md ${viewType === 'map' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {viewType === 'list' ? (
        <div className="space-y-4">
          {filteredLocations.map(location => (
            <LocationCard key={location.id} location={location} />
          ))}
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No locations found for this category.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">Map view will be implemented in future updates.</p>
        </div>
      )}
    </div>
  );
};

export default DisposalLocations;