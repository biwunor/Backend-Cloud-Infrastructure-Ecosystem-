import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import UwLogo from '@/assets/images/uw-logo.png';

const Header = ({ currentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={UwLogo} alt="UW Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-800">WasteWise</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="hidden md:block text-sm text-gray-600">
              Hi, {currentUser.displayName || 'User'}
            </span>
          )}
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="container mx-auto px-4 py-3 bg-white border-t">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
            
            {currentUser ? (
              <>
                <Link to="/profile" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/dispose" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Dispose Waste</Link>
                <Link to="/map" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Find Disposal Locations</Link>
                <Link to="/shop" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Shop</Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }} 
                  className="py-2 text-red-600 hover:text-red-700 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="py-2 hover:text-green-700 transition-colors" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;