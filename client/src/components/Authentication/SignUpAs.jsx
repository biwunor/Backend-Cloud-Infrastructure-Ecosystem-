// TODO: Remember to set up the submit button logic when a user selects a role and clicks submit
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import WasteCollector from "../../assets/images/waste-collector.png";
import WasteDepositor from "../../assets/images/waste-depositor.png";

const SignUpAs = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleBackClick = () => {
    navigate("/register");
  };

  const handleSubmit = () => {
    console.log("Submit clicked, selectedRole:", selectedRole);
    if (selectedRole === "collector") {
      navigate("/homepage");
    } else if (selectedRole === "depositor") {
      navigate("/homepage");
    }
  };

  const handleRoleSelect = (role) => {
    console.log("Role selected:", role);
    setSelectedRole(role);
  };

  return (
    <div className="relative flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="absolute left-2 top-2">
        <button
          onClick={handleBackClick}
          className="text-lg flex items-center sm:text-xl md:text-2xl"
        >
          <FaArrowLeft className="mr-1" />
          Back
        </button>
      </div>
      <div className="mt-10 text-center w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <h1 className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl mb-4">
          Signup As
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base md:text-lg">
          {selectedRole
            ? "Choose who you want to signup as"
            : "Sign up now to schedule your first waste pickup and start making an impact."}
        </p>
      </div>
      <div className="flex flex-wrap justify-around w-full mt-8 gap-4">
        <div
          className={`cursor-pointer flex flex-col items-center justify-center w-40 h-52 sm:w-48 sm:h-60 md:w-56 md:h-64 lg:w-64 lg:h-72 rounded-lg p-3 transition-all duration-300 ${
            selectedRole === "collector"
              ? "shadow-lg border-4 border-green-900 bg-green-900 text-white"
              : "bg-white"
          }`}
          onClick={() => handleRoleSelect("collector")}
        >
          <img
            src={WasteCollector}
            alt="Waste Collector"
            className="w-full h-full object-cover rounded-md"
          />
          <p
            className={`mt-2 font-bold text-sm sm:text-base md:text-lg ${
              selectedRole === "collector" ? "text-white" : "text-black"
            }`}
          >
            Waste Collector
          </p>
        </div>
        <div
          className={`cursor-pointer flex flex-col items-center justify-center w-40 h-52 sm:w-48 sm:h-60 md:w-56 md:h-64 lg:w-64 lg:h-72 rounded-lg p-3 transition-all duration-300 ${
            selectedRole === "depositor"
              ? "shadow-lg border-4 border-green-900 bg-green-900 text-white"
              : "bg-white"
          }`}
          onClick={() => handleRoleSelect("depositor")}
        >
          <img
            src={WasteDepositor}
            alt="Waste Depositor"
            className="w-full h-full object-cover rounded-md"
          />
          <p
            className={`mt-2 font-bold text-sm sm:text-base md:text-lg ${
              selectedRole === "depositor" ? "text-white" : "text-black"
            }`}
          >
            Waste Depositor
          </p>
        </div>
      </div>
      <div className="mt-10 flex justify-center w-full">
        <button
          onClick={handleSubmit}
          className={`py-2 px-4 rounded-full w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg ${
            selectedRole ? "bg-green-800 cursor-pointer" : "bg-neutral-400"
          } text-white transition-all duration-300`}
          disabled={!selectedRole}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SignUpAs;
