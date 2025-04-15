import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import UwLogo from '@/assets/images/uw-logo.png';
import RecyclingImage from '@/assets/images/recycling.png';
import TrashbinImage from '@/assets/images/trashbin.png';

const OnboardingStep = ({ image, title, description, currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
      <img 
        src={image} 
        alt={title} 
        className="w-64 h-64 object-contain mb-8"
      />
      <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all ${
              i === currentStep ? 'w-8 bg-green-700' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [
    {
      image: UwLogo,
      title: 'Welcome to UW WasteWise',
      description: 'Your comprehensive waste management companion for the UW community.'
    },
    {
      image: RecyclingImage,
      title: 'Track Your Recycling',
      description: 'Record and monitor your recycling habits to help reduce waste on campus.'
    },
    {
      image: TrashbinImage,
      title: 'Find Disposal Locations',
      description: 'Easily locate the nearest recycling bins, compost stations, and waste collection points.'
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding complete, navigate to home
      navigate('/');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        <OnboardingStep 
          {...steps[currentStep]} 
          currentStep={currentStep} 
          totalSteps={steps.length} 
        />
      </div>
      
      <div className="py-6 px-8 flex justify-between items-center">
        {currentStep > 0 ? (
          <button 
            onClick={handlePrevious}
            className="flex items-center text-gray-600 font-medium"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
        ) : (
          <button 
            onClick={handleSkip}
            className="text-gray-600 font-medium"
          >
            Skip
          </button>
        )}
        
        <button 
          onClick={handleNext}
          className="flex items-center bg-green-700 text-white px-6 py-2 rounded-full font-medium"
        >
          {currentStep < steps.length - 1 ? (
            <>
              Next
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;