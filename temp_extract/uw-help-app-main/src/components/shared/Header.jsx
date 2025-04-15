import React, { useState } from "react";
import UwLogo from "../../assets/images/uw-logo2.png";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import MenuItems from "./MenuItems";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenChange = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  return (
    <div className="flex justify-between items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div>
        <img
          src={UwLogo}
          alt="UW Logo"
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
        />
      </div>

      {/* Hamburger Icon */}
      <Sheet onOpenChange={handleOpenChange} open={isMenuOpen}>
        <SheetTrigger asChild>
          <button className="cursor-pointer">
            <HiOutlineMenu className="w-6 h-6 text-black opacity-70 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-64 h-full bg-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between"
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center mb-4">
            <SheetTitle className="text-black font-semibold text-lg sm:text-xl md:text-2xl">
              Uw-help
            </SheetTitle>
            <HiX
              className="w-6 h-6 text-black cursor-pointer sm:w-8 sm:h-8 md:w-10 md:h-10"
              onClick={() => handleOpenChange(false)}
            />
          </div>
          <hr className="border-neutral-400 mb-4" />
          {/* Import Menu Items */}
          <MenuItems />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
