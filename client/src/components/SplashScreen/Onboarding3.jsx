import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import recyclingImage2 from "../../assets/images/recycling2.png";

const Onboarding3 = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/onboarding2");
  };

  const handleSkipClick = () => {
    navigate("/register");
  };

  const handleNextClick = () => {
    navigate("/register");
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
      <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <img
          src={recyclingImage2}
          alt="Recycling"
          className="w-[80%] max-w-[400px] h-auto mt-1 mb-20"
        />
        <section className="mt-[-10%] mb-5">
          <h1 className="text-lg font-bold text-center mb-4 sm:text-xl md:text-2xl lg:text-3xl">
            How UW Help Works
          </h1>
          <div className="w-full max-w-[90%] h-auto gap-4 flex flex-col">
            <div className="pl-2">
              <ul className="list-none space-y-4">
                <li className="flex items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-green-800 bg-green-800 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-2 leading-[1.4] text-xs sm:text-sm md:text-base lg:text-lg">
                    Schedule waste pickups at your convenience.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-green-800 bg-green-800 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-2 leading-[1.4] text-xs sm:text-sm md:text-base lg:text-lg">
                    Get Matched with verified agents.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-green-800 bg-green-800 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-2 leading-[1.4] text-xs sm:text-sm md:text-base lg:text-lg">
                    Dispose hazardous waste.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-green-800 bg-green-800 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-2 leading-[1.4] text-xs sm:text-sm md:text-base lg:text-lg">
                    Sell scraps.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <button
          className="bg-green-800 text-white w-[80%] max-w-[400px] h-12 sm:h-14 md:h-16 lg:h-18 gap-2 rounded-full mx-auto cursor-pointer mb-4 lg:mb-8"
          onClick={handleNextClick}
        >
          Next
        </button>
      </main>
    </div>
  );
};

export default Onboarding3;