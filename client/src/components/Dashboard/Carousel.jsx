import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import TrashBinImage from "../../assets/images/trashbin.png";

const Carousel = ({ activeSection, setActiveSection }) => {
  return (
    <div>
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className={`flex transition-transform duration-500 ${
            activeSection === 1
              ? "translate-x-0"
              : activeSection === 2
              ? "-translate-x-full"
              : "-translate-x-[200%]"
          }`}
        >
          {/* First Section */}
          <div className="w-full flex-shrink-0">
            <div className="mt-5 mx-4 p-6 border-2 border-gray-200 rounded-md bg-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold">
                    Want to Dispose your waste?
                  </h1>
                  <p className="text-sm text-gray-800 mt-2">
                    Keep Environment clean and healthy
                  </p>
                  <div className="mt-4">
                    <button className="bg-green-800 text-white border border-green-800 px-4 py-2 rounded-full flex items-center cursor-pointer">
                      Dispose Waste
                      <PlusIcon className="ml-1 w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <img
                    src={TrashBinImage}
                    alt="Trash Bin"
                    className="w-32 h-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="w-full flex-shrink-0">
            <div className="mt-5 mx-4 p-6 border-2 border-gray-200 rounded-md bg-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold">Upcoming Events</h1>
                  <p className="text-sm text-gray-800 mt-2">
                    Community Sanitation & Waste Day
                  </p>
                  <div className="mt-4">
                    <button className="bg-green-800 text-white border border-green-800 px-4 py-2 rounded-full flex items-center cursor-pointer">
                      Register
                      <PlusIcon className="ml-1 w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <img
                    src={TrashBinImage}
                    alt="Trash Bin"
                    className="w-32 h-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Radio Buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          className={`w-4 h-4 rounded-full ${
            activeSection === 1 ? "bg-green-800" : "bg-gray-300 cursor-pointer"
          }`}
          onClick={() => setActiveSection(1)}
        ></button>
        <button
          className={`w-4 h-4 rounded-full ${
            activeSection === 2 ? "bg-green-800" : "bg-gray-300 cursor-pointer"
          }`}
          onClick={() => setActiveSection(2)}
        ></button>
      </div>
    </div>
  );
};

export default Carousel;