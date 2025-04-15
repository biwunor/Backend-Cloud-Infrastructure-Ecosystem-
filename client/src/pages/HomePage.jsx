import React, { useState } from 'react';
import { HomeIcon, MapIcon, UserIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import UwLogo from '../assets/images/uw-logo.png';

// Components
import Header from '../components/Header';
import WasteManager from '../components/WasteManager';
import RecyclingTips from '../components/RecyclingTips';
import Footer from '../components/Footer';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow p-4">
        <section className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <img src={UwLogo} alt="User" className="h-12 w-12 rounded-full" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Hello, UW Student</h2>
              <p className="text-gray-600">Welcome to WasteWise</p>
            </div>
          </div>
          
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search disposal methods..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>
        
        <WasteManager />
        <RecyclingTips />
      </main>
      
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default HomePage;