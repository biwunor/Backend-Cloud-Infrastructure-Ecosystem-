import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { 
  UserIcon, 
  IdentificationIcon, 
  CogIcon, 
  BellIcon, 
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const UserProfile = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
    }
  };
  
  // Mock user stats
  const userStats = {
    totalDisposed: 42,
    recyclingRate: 68,
    treesEquivalent: 2.5,
    waterSaved: 350
  };
  
  const menuItems = [
    { 
      id: 'account', 
      title: 'Account Settings', 
      icon: <CogIcon className="h-6 w-6" />,
      onClick: () => console.log('Account settings clicked')
    },
    { 
      id: 'notifications', 
      title: 'Notifications', 
      icon: <BellIcon className="h-6 w-6" />,
      onClick: () => console.log('Notifications clicked')
    },
    { 
      id: 'help', 
      title: 'Help & Support', 
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
      onClick: () => console.log('Help clicked')
    },
    { 
      id: 'signout', 
      title: 'Sign Out', 
      icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />,
      onClick: handleSignOut,
      danger: true
    }
  ];
  
  return (
    <div className="container mx-auto px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <UserIcon className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {currentUser?.displayName || 'UW Student'}
              </h2>
              <p className="text-gray-600">{currentUser?.email || 'student@uw.edu'}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium mb-4">Your Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Waste Disposed</p>
                <p className="text-2xl font-bold text-blue-700">{userStats.totalDisposed} kg</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Recycling Rate</p>
                <p className="text-2xl font-bold text-green-700">{userStats.recyclingRate}%</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Trees Equivalent</p>
                <p className="text-2xl font-bold text-yellow-700">{userStats.treesEquivalent}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Water Saved</p>
                <p className="text-2xl font-bold text-indigo-700">{userStats.waterSaved} L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={item.onClick}
                disabled={item.id === 'signout' && loading}
                className={`w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                  item.danger ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
                {item.id === 'signout' && loading && (
                  <span className="ml-2 text-sm">Signing out...</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;