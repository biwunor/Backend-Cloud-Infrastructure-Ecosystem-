import React, { useEffect, useState } from "react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import CompletedWasteIcon from "../../assets/images/completed-waste.png";

const CompletedWasteList = ({ onCardClick }) => {
  const [completedWasteSummary, setCompletedWasteSummary] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
  };

  useEffect(() => {
    const simulatedCompletedWaste = [
      {
        collector: "Clean Waste Collector",
        type: "Chemical waste that is properly tied",
        location: "Lekki, Phase 1",
        date: "2025-03-15",
        time: "10:30 AM",
        paymentStatus: "Paid",
        collectionStatus: "Picked",
      },
      {
        collector: "Eco Waste Services",
        type: "Plastic waste",
        location: "Ikeja, Lagos",
        date: "2025-03-20",
        time: "2:00 PM",
        paymentStatus: "Unpaid",
        collectionStatus: "Pending",
      },
      {
        collector: "Green Earth Collectors",
        type: "Organic waste",
        location: "Victoria Island, Lagos",
        date: "2025-03-25",
        time: "9:00 AM",
        paymentStatus: "Paid",
        collectionStatus: "Picked",
      },
      {
        collector: "WastePro",
        type: "E-waste",
        location: "Yaba, Lagos",
        date: "2025-03-30",
        time: "11:00 AM",
        paymentStatus: "Unpaid",
        collectionStatus: "Pending",
      },
    ];

    setCompletedWasteSummary(simulatedCompletedWaste);
  }, []);

  return (
    <div className="mt-5 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <h2 className="text-left text-2xl font-semibold text-black mb-6 sm:text-3xl md:text-4xl">
        Completed waste summary
      </h2>
      {completedWasteSummary.length > 0 ? (
        completedWasteSummary.map((waste, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg p-3 border-l-4 border-green-800 drop-shadow-md flex flex-col gap-3 w-full max-w-[407px] h-auto mb-4 cursor-pointer sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]"
            onClick={() => onCardClick(waste)}
          >
            <div className="flex items-start gap-4">
              <img
                src={CompletedWasteIcon}
                alt="Trash Disposal Icon"
                className="w-16 h-16 rounded-full sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-20 xl:h-20 2xl:w-18 2xl:h-18"
              />
              <div className="flex-1">
                <h5 className="text-sm font-bold text-black sm:text-base md:text-lg">
                  {waste.collector}
                </h5>
                <p className="text-sm text-black -mt-1 sm:text-base md:text-lg">
                  {waste.type}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <HiOutlineLocationMarker className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  <span className="text-sm text-black sm:text-base md:text-lg">
                    {waste.location}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <AiOutlineCalendar className="text-zinc-500 font-medium mr-1 sm:text-lg md:text-xl" />
                    <span className="text-sm font-medium text-zinc-500 sm:text-base md:text-lg">
                      {formatDate(waste.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <AiOutlineClockCircle className="text-zinc-500 mr-1 sm:text-lg md:text-xl" />
                    <span className="text-sm text-zinc-500 sm:text-base md:text-lg">
                      {waste.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-lg font-bold text-black sm:text-xl md:text-2xl">
          No completed waste deposits yet.
        </h1>
      )}
    </div>
  );
};

export default CompletedWasteList;