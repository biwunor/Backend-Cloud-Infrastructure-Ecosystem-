import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import TrashDisposal1 from '@/assets/images/trash-disposal1.png';
import TrashDisposal2 from '@/assets/images/trash-disposal2.png';
import TrashDisposal3 from '@/assets/images/trash-disposal3.png';

const RecyclingTips = () => {
  const tips = [
    {
      id: 1,
      title: 'Separate Your Recyclables',
      description: 'Keep paper, plastic, glass, and metal separated for easier processing.',
      image: TrashDisposal1
    },
    {
      id: 2,
      title: 'Clean Before Recycling',
      description: 'Rinse food containers before placing them in recycling bins.',
      image: TrashDisposal2
    },
    {
      id: 3,
      title: 'Know What\'s Recyclable',
      description: 'Not all plastics are recyclable. Check for recycling symbols.',
      image: TrashDisposal3
    }
  ];
  
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recycling Tips</h2>
        <button className="text-sm text-green-700 flex items-center">
          View All <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="grid gap-4">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white rounded-xl shadow p-4 flex items-center">
            <img 
              src={tip.image} 
              alt={tip.title} 
              className="h-16 w-16 rounded-lg object-cover mr-4" 
            />
            <div>
              <h3 className="font-medium text-gray-900">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecyclingTips;