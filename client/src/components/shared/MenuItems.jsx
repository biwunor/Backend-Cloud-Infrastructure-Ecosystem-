import React from "react";
import { Link } from "react-router-dom";
import { SheetClose } from "../ui/sheet";
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon, 
  BellIcon,
  InformationCircleIcon,
  LifebuoyIcon
} from "@heroicons/react/24/outline";

const MenuItems = () => {
  const menuItems = [
    {
      name: "Home",
      path: "/homepage",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <CogIcon className="w-5 h-5" />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <BellIcon className="w-5 h-5" />,
    },
    {
      name: "Help",
      path: "/help",
      icon: <LifebuoyIcon className="w-5 h-5" />,
    },
    {
      name: "About",
      path: "/about",
      icon: <InformationCircleIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <SheetClose key={item.name} asChild>
          <Link
            to={item.path}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-green-800">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        </SheetClose>
      ))}
    </div>
  );
};

export default MenuItems;