import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import recyclingImage from "../../assets/images/recycling.png";

const Onboarding2 = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSkipClick = () => {
    navigate("/onboarding3");
  };

  const handleGetStartedClick = () => {
    navigate("/onboarding3");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center relative px-6 sm:px-10 md:px-20 lg:px-28 xl:px-36 2xl:px-44">
      <header className="absolute top-8 left-6 sm:top-10 sm:left-8 md:top-12 md:left-10 lg:top-14 lg:left-12">
        <FaArrowLeft
          className="text-zinc-900 w-4 h-4 cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6"
          onClick={handleBackClick}
        />
      </header>
      <nav
        className="absolute top-8 right-6 sm:top-10 sm:right-8 md:top-12 md:right-10 lg:top-14 lg:right-12 text-green-800 cursor-pointer font-sans font-normal text-lg leading-6 tracking-wide text-center align-middle sm:text-xl md:text-2xl"
        onClick={handleSkipClick}
      >
        Skip
      </nav>
      <main className="flex flex-col items-center justify-center space-y-4 text-center">
        <section>
          <img
            src={recyclingImage}
            alt="Recycling"
            className="w-[80%] max-w-[400px] h-auto"
          />
        </section>
        <section className="flex flex-col items-center">
          <h1 className="text-black font-bold text-center leading-[120%] tracking-[-2%] text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Welcome to UW Help!
          </h1>
          <p className="text-black text-center leading-[140%] text-sm sm:text-base md:text-lg lg:text-xl mb-4">
            Dispose of waste responsibly and connect with trusted garbage
            carriers and plumbers in your area.
          </p>
        </section>
        <button
          className="bg-green-800 text-white w-[80%] max-w-[400px] h-12 sm:h-14 md:h-16 lg:h-18 gap-2 rounded-full mx-auto cursor-pointer mb-4 lg:mb-8 text-sm sm:text-base md:text-lg lg:text-xl"
          onClick={handleGetStartedClick}
        >
          Next
        </button>
      </main>
    </div>
  );
};

export default Onboarding2;
