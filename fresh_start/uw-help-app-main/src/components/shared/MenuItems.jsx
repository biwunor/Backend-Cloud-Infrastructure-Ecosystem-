import React from "react";
import {
  HiOutlineBookOpen,
  HiOutlineArchiveBox,
  HiOutlineCreditCard,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MenuItems = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Menu Items */}
      <ul className="space-y-6 sm:space-y-8 md:space-y-10">
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/dashboard")}
        >
          <HiOutlineBookOpen className="w-5 h-5 text-purple-500 mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Dashboard
        </li>
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/pastWaste")}
        >
          <HiOutlineArchiveBox className="w-5 h-5 text-blue-500 mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Past Waste
        </li>
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/subscription")}
        >
          <HiOutlineCreditCard className="w-5 h-5 text-pink-700 mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Subscription
        </li>
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/support")}
        >
          <HiOutlineQuestionMarkCircle className="w-5 h-5 text-green-500 mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Support
        </li>
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/settings")}
        >
          <HiOutlineCog className="w-5 h-5 text-yellow-600 mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Settings
        </li>
      </ul>

      {/* Logout Item */}
      <ul className="mt-auto pt-10 sm:pt-12 md:pt-14">
        <li
          className="flex items-center text-black cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => navigate("/logout")}
        >
          <FiLogOut className="w-5 h-5 text-black mr-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default MenuItems;
