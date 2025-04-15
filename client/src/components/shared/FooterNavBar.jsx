import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon,
  MapIcon,
  UserIcon,
  PlusCircleIcon,
  ShoppingBagIcon 
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid,
  MapIcon as MapIconSolid,
  UserIcon as UserIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid 
} from "@heroicons/react/24/solid";

const FooterNavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Home",
      path: "/homepage",
      icon: currentPath === "/homepage" ? <HomeIconSolid className="w-6 h-6" /> : <HomeIcon className="w-6 h-6" />,
    },
    {
      name: "Map",
      path: "/map",
      icon: currentPath === "/map" ? <MapIconSolid className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />,
    },
    {
      name: "Dispose",
      path: "/default",
      icon: currentPath === "/default" ? <PlusCircleIconSolid className="w-6 h-6" /> : <PlusCircleIcon className="w-6 h-6" />,
    },
    {
      name: "Shop",
      path: "/shop",
      icon: currentPath === "/shop" ? <ShoppingBagIconSolid className="w-6 h-6" /> : <ShoppingBagIcon className="w-6 h-6" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: currentPath === "/profile" ? <UserIconSolid className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center ${
              currentPath === item.path ? "text-green-800" : "text-gray-500"
            }`}
          >
            <div>{item.icon}</div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterNavBar;