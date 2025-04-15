import React, { useState } from "react";
import { Link } from "react-router-dom";
import TrashDisposal1 from "../../assets/images/trash-disposal1.png";
import TrashDisposal2 from "../../assets/images/trash-disposal2.png";
import TrashDisposal3 from "../../assets/images/trash-disposal3.png";
import TrashDisposal4 from "../../assets/images/trash-disposal4.png";
import { MapPinIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const WasteCollectors = () => {
  const collectors = [
    { id: 1, image: TrashDisposal1 },
    { id: 2, image: TrashDisposal2 },
    { id: 3, image: TrashDisposal3 },
    { id: 4, image: TrashDisposal4 },
  ];

  const [ratings, setRatings] = useState({});

  const handleRating = (collectorId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [collectorId]: rating,
    }));
  };

  return (
    <div className="mt-5 mx-4 py-6 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 2xl:mx-40">
      <div>
        <h1 className="text-xl font-bold mt-4 pl-4 sm:text-2xl md:text-3xl">Waste collectors nearby</h1>
      </div>

      <div className="space-y-4 mt-4">
        {collectors.map((collector) => (
          <div
            key={collector.id}
            className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10"
          >
            <img
              src={collector.image}
              alt={`Trash Disposal ${collector.id}`}
              className="w-32 h-32 rounded-md sm:w-40 sm:h-40 md:w-48 md:h-48"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h1 className="text-lg sm:text-xl md:text-2xl">
                  {collector.id === 3
                    ? "Ugo group waste"
                    : "Ugo group waste disposal"}
                </h1>
                <EllipsisVerticalIcon className="w-5 h-5 text-black cursor-pointer sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <p className="text-sm text-zinc-600 flex items-center mt-2 sm:text-base md:text-lg">
                <MapPinIcon className="w-4 h-4 mr-1 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Rumeukpor, Port
                Harcourt
              </p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-4 h-4 cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                      ratings[collector.id] >= star
                        ? "text-yellow-300"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRating(collector.id, star)}
                  />
                ))}
              </div>
              <Link to="/default" className="mt-3 inline-block">
                <button className="bg-green-800 text-white px-4 py-2 rounded-full cursor-pointer sm:px-6 sm:py-3 md:px-8 md:py-4">
                  Book waste pickup
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteCollectors;