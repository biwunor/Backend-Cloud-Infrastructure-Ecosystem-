import React, { useState, useEffect } from "react";
import Header from "../shared/Header";
import FooterNavBar from "../shared/FooterNavBar";
import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import CompletedWasteList from "../shared/CompletedWasteList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalWaste, setTotalWaste] = useState(0);
  const [lastDisposalDate, setLastDisposalDate] = useState("");
  const [lastDisposalWeight, setLastDisposalWeight] = useState(0);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/homepage");
  };

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
    navigate("/pastWaste");
  };

  useEffect(() => {
    const simulatedData = {
      totalWaste: 120,
      lastDisposalDate: "2nd April, 2025", // Text format: "2nd April, 2025"
      lastDisposalWeight: 15,
      upcomingEvent: {
        title: "Community Sanitation & Waste Day",
        date: "3rd April, 2025",
      },
    };

    setTotalWaste(simulatedData.totalWaste);
    setLastDisposalDate(simulatedData.lastDisposalDate);
    setLastDisposalWeight(simulatedData.lastDisposalWeight);
    setUpcomingEvent(simulatedData.upcomingEvent);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header isMenuOpen={isMenuOpen} handleOpenChange={setIsMenuOpen} />
      <div className="flex items-center justify-between mt-4 px-4 md:px-8 lg:px-12 xl:px-16">
        <FaArrowLeft
          className="w-4 h-4 text-black cursor-pointer md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6"
          onClick={handleBackClick}
        />
        <h1 className="text-center text-2xl font-semibold text-black flex-grow md:text-3xl lg:text-3xl xl:text-4xl">
          Dashboard
        </h1>
      </div>

      <div className="flex-grow">
        <div className="mt-6">
          <h2 className="text-left ml-4 text-2xl font-semibold text-black md:ml-8 lg:ml-12 xl:ml-16 md:text-2xl lg:text-3xl xl:text-3xl">
            Waste Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mt-6 sm:gap-6 md:gap-6 md:px-8 lg:px-12 xl:px-16">
          {/* Card 1: Total Waste */}
          <div className="relative border border-yellow-50 bg-yellow-50 rounded-lg p-3 flex-1 h-[110px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
            <div>
              <h5 className="text-left text-sm font-normal text-black sm:text-base md:text-base lg:text-lg xl:text-lg">
                All Total Waste
              </h5>
              <h4 className="text-sm text-black font-bold mt-2 sm:text-base md:text-lg lg:text-lg xl:text-lg">
                {totalWaste}kg
              </h4>
              <div className="flex items-center mt-4">
                <AiOutlineCalendar className="text-zinc-600 mr-2 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6" />
                <span className="text-sm text-zinc-600 sm:text-base md:text-base lg:text-lg xl:text-lg">
                  {lastDisposalDate}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Last Disposal */}
          <div className="relative border border-green-50 bg-green-50 rounded-lg p-3 flex-1 h-[110px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
            <div>
              <h5 className="text-left text-sm font-normal text-black sm:text-base md:text-base lg:text-lg xl:text-lg">
                Last Disposal
              </h5>
              <h4 className="text-sm text-black font-bold mt-2 sm:text-base md:text-lg lg:text-lg xl:text-lg">
                {lastDisposalWeight}kg
              </h4>
              <div className="flex items-center mt-4">
                <AiOutlineCalendar className="text-zinc-600 mr-2 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6" />
                <span className="text-sm text-zinc-600 sm:text-base md:text-base lg:text-lg xl:text-lg">
                  {lastDisposalDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-left ml-4 text-2xl font-semibold text-black mt-6 md:ml-8 lg:ml-12 xl:ml-16 md:text-2xl lg:text-3xl xl:text-3xl">
            Events
          </h2>
        </div>
        <div className="px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="border border-yellow-300 bg-yellow-300 rounded-lg p-4 mt-6 h-[120px] md:h-[140px] lg:h-[150px] xl:h-[160px]">
            <div>
              <h5 className="text-left text-sm font-semibold text-black md:text-base lg:text-base xl:text-lg">
                Upcoming Events
              </h5>
              {upcomingEvent ? (
                <h4 className="text-sm text-black font-semibold mt-1 md:text-base lg:text-base xl:text-lg">
                  {upcomingEvent.title}
                </h4>
              ) : (
                <h4 className="text-sm text-black font-semibold mt-1 md:text-base lg:text-base xl:text-lg">
                  No upcoming events
                </h4>
              )}
            </div>
            <div className="pt-3">
              <button className="bg-green-800 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-green-900 md:text-base lg:text-base xl:text-lg">
                Register
              </button>
            </div>
          </div>
        </div>

        <CompletedWasteList onCardClick={handleCardClick} />
      </div>

      <FooterNavBar />
    </div>
  );
};

export default Dashboard;
