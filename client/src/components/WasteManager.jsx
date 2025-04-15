import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import TrashBinImage from '@/assets/images/trashbin.png';
import RecyclingImage from '@/assets/images/recycling.png';

const WasteManager = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: 'Dispose Your Waste',
      description: 'Keep the environment clean and healthy',
      image: TrashBinImage,
      buttonText: 'Dispose Waste',
      buttonLink: '/dispose'
    },
    {
      title: 'Recycling Guide',
      description: 'Learn how to properly recycle different materials',
      image: RecyclingImage,
      buttonText: 'View Guide',
      buttonLink: '/recycling'
    }
  ];
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Waste Management</h2>
        <button className="text-sm text-green-700 flex items-center">
          View All <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="relative overflow-hidden bg-white rounded-xl shadow">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{slide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{slide.description}</p>
                  <Link 
                    to={slide.buttonLink}
                    className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-full text-sm"
                  >
                    {slide.buttonText}
                    <PlusIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <img src={slide.image} alt={slide.title} className="h-28 w-28 object-contain" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index ? 'w-6 bg-green-700' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WasteManager;