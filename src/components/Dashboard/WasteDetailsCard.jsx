import React, { useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import CompletedWasteIcon from "../../assets/images/completed-waste.png";
import RatingDialog from "./RatingDialog";

const WasteDetailsCard = ({
  paymentStatus,
  collectionStatus,
  formattedDate,
  formattedTime,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    setIsRated(true);
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="w-full max-w-sm rounded-lg p-4 border border-gray-200 shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl">
        <img
          src={CompletedWasteIcon}
          alt="Trash Disposal"
          className="w-full h-auto rounded-lg object-contain"
        />
        <div className="text-left font-normal mt-6 space-y-2">
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Collector:</span> Clean Waste Collector
          </p>
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Waste Type:</span> Chemical waste
          </p>
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Quantity:</span> 35kg
          </p>
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Waste Reference:</span> 1023456
          </p>
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Payment Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-sm sm:text-base md:text-lg ${
                paymentStatus === "Paid"
                  ? "bg-gray-200 text-green-900"
                  : "text-gray-800"
              }`}
            >
              {paymentStatus}
            </span>
          </p>
          <p className="text-lg text-gray-800 sm:text-xl md:text-2xl">
            <span>Collection Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-sm sm:text-base md:text-lg ${
                collectionStatus === "Picked"
                  ? "bg-purple-100 text-purple-500"
                  : "text-gray-800"
              }`}
            >
              {collectionStatus}
            </span>
          </p>
          <p className="text-lg text-zinc-600 flex items-center sm:text-xl md:text-2xl">
            <span className="text-black">Date:</span>
            <AiOutlineCalendar className="ml-1 mr-1 text-zinc-600" />
            {formattedDate}
          </p>
          <p className="text-lg text-zinc-600 flex items-center sm:text-xl md:text-2xl">
            <span className="text-black">Time:</span>
            <AiOutlineClockCircle className="ml-1 mr-1 text-zinc-600" />
            {formattedTime}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-10 mb-5 w-full items-center">
        <button
          className="px-15 py-2 bg-green-800 text-white rounded-full cursor-pointer sm:px-20 sm:py-3 md:px-24 md:py-4"
          onClick={() => alert("Book Waste Pickup functionality coming soon!")}
        >
          Book waste pickup
        </button>
        <button
          className="px-3 py-1.5 bg-white text-green-900 border border-green-900 rounded-full cursor-pointer hover:bg-neutral-200 sm:px-4 sm:py-2 md:px-6 md:py-3"
          onClick={() => setIsDialogOpen(true)}
        >
          Rate this service
        </button>
      </div>

      <RatingDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        handleRating={handleRating}
        rating={rating}
        isRated={isRated}
      />
    </div>
  );
};

export default WasteDetailsCard;