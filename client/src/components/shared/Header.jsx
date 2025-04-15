import React from "react";
import { Link } from "react-router-dom";
import UwLogo from "../../assets/images/uw-logo.png";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "../ui/sheet";
import { Bars3Icon } from "@heroicons/react/24/outline";
import MenuItems from "./MenuItems";

const Header = ({ isMenuOpen, handleOpenChange }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      <div className="flex items-center">
        <Link to="/">
          <img src={UwLogo} alt="UW Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
        </Link>
        <h1 className="text-lg font-bold ml-2 sm:text-xl md:text-2xl">WasteWise</h1>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <button className="cursor-pointer">
            <Bars3Icon className="w-6 h-6 text-black opacity-70 sm:w-7 sm:h-7" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-white">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <img src={UwLogo} alt="UW Logo" className="w-8 h-8" />
                  <h1 className="text-lg font-bold ml-2">WasteWise</h1>
                </div>
                <SheetClose className="rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
                  &times;
                </SheetClose>
              </div>
              <MenuItems />
            </div>
            <div className="mb-4">
              <SheetClose asChild>
                <Link
                  to="/login"
                  className="w-full py-2 px-4 rounded-md bg-red-600 text-white text-center inline-block"
                >
                  Logout
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;