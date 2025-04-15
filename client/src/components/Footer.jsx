import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, MapPinIcon, PlusCircleIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MapPinIcon as MapPinIconSolid, PlusCircleIcon as PlusCircleIconSolid, ShoppingBagIcon as ShoppingBagIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

const Footer = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    {
      id: 'home',
      name: 'Home',
      path: '/',
      icon: activeTab === 'home' ? <HomeIconSolid className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />
    },
    {
      id: 'map',
      name: 'Map',
      path: '/map',
      icon: activeTab === 'map' ? <MapPinIconSolid className="h-6 w-6" /> : <MapPinIcon className="h-6 w-6" />
    },
    {
      id: 'dispose',
      name: 'Dispose',
      path: '/dispose',
      icon: activeTab === 'dispose' ? <PlusCircleIconSolid className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />
    },
    {
      id: 'shop',
      name: 'Shop',
      path: '/shop',
      icon: activeTab === 'shop' ? <ShoppingBagIconSolid className="h-6 w-6" /> : <ShoppingBagIcon className="h-6 w-6" />
    },
    {
      id: 'profile',
      name: 'Profile',
      path: '/profile',
      icon: activeTab === 'profile' ? <UserIconSolid className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />
    }
  ];
  
  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 py-2">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center"
              onClick={() => setActiveTab(item.id)}
            >
              <div className={`${activeTab === item.id ? 'text-green-700' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;