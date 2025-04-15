import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../shared/Header";
import FooterNavBar from "../shared/FooterNavBar";
import { FaArrowLeft } from "react-icons/fa";

const Recycle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <Header />
      <div className="flex items-center justify-between mt-4">
        <FaArrowLeft
          className="w-4 h-4 text-black cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6"
          onClick={handleBackClick}
        />
        <h1 className="text-center text-2xl font-semibold text-black flex-grow sm:text-3xl md:text-4xl">
          Recycle
        </h1>
      </div>

      <FooterNavBar />
    </div>
  );
};

export default Recycle;
