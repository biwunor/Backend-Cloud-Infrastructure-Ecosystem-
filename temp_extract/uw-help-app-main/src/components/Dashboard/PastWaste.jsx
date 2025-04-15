import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import FooterNavBar from "../shared/FooterNavBar";
import WasteDetailsCard from "./WasteDetailsCard";
import CompletedWasteList from "../shared/CompletedWasteList";
import { AiOutlineArrowLeft } from "react-icons/ai";

const PastWaste = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenChange = (open) => {
    setIsMenuOpen(open);
  };

  const handleBackClick = () => {
    if (selectedWaste) {
      setSelectedWaste(null);
    } else {
      navigate("/dashboard");
    }
  };

  const handleWasteClick = (waste) => {
    setSelectedWaste(waste);
  };

  return (
    <div className={`bg-white min-h-screen flex flex-col ${isMenuOpen ? 'inert' : ''} px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40`}>
      <Header isMenuOpen={isMenuOpen} handleOpenChange={handleOpenChange} />
      <div className="flex items-center justify-between mt-4">
        <AiOutlineArrowLeft
          onClick={handleBackClick}
          className="text-lg cursor-pointer sm:text-xl md:text-2xl"
        />
        <h1 className="text-center text-2xl font-semibold text-black flex-grow sm:text-3xl md:text-4xl">
          Past Waste
        </h1>
      </div>

      <div className="flex-grow mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        {selectedWaste ? (
          <div className="flex justify-center">
            <WasteDetailsCard
              paymentStatus={selectedWaste.paymentStatus}
              collectionStatus={selectedWaste.collectionStatus}
              formattedDate={selectedWaste.date}
              formattedTime={selectedWaste.time}
            />
          </div>
        ) : (
          <CompletedWasteList onCardClick={handleWasteClick} />
        )}
      </div>

      <FooterNavBar />
    </div>
  );
};

export default PastWaste;
