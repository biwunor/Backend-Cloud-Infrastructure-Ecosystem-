import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import RecyclingImage from '@/assets/images/recycling.png';
import TrashbinImage from '@/assets/images/trashbin.png';

const wasteTypes = [
  { id: 'general', name: 'General Waste', image: TrashbinImage, color: 'bg-gray-200' },
  { id: 'recycling', name: 'Recycling', image: RecyclingImage, color: 'bg-blue-100' },
  { id: 'compost', name: 'Compost', image: TrashbinImage, color: 'bg-green-100' },
  { id: 'hazardous', name: 'Hazardous Waste', image: TrashbinImage, color: 'bg-red-100' },
  { id: 'electronic', name: 'Electronic Waste', image: TrashbinImage, color: 'bg-yellow-100' }
];

const DisposeWaste = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      alert('Please select a waste type');
      return;
    }
    
    try {
      setLoading(true);
      
      // Here we would submit the waste record to the backend
      // For now, we'll just simulate a successful submission
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting waste record:', error);
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Dispose Waste</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Waste Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wasteTypes.map((type) => (
              <div 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedType === type.id 
                    ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' 
                    : 'border-gray-200 hover:border-green-200'
                } ${type.color}`}
              >
                <div className="flex items-center">
                  <img src={type.image} alt={type.name} className="w-12 h-12 object-contain mr-3" />
                  <span className="font-medium">{type.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-2">
            Approximate Weight (kg)
          </label>
          <input 
            type="number" 
            id="weight"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Enter weight in kg"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Describe the waste items..."
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full bg-green-700 text-white py-3 px-4 rounded-md hover:bg-green-800 transition-colors disabled:opacity-70"
          >
            {loading ? (
              'Submitting...'
            ) : (
              <>
                Submit Waste Record
                <PaperAirplaneIcon className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisposeWaste;