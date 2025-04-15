import React from "react";
import { useNavigate } from "react-router-dom";
import uwLogo from "../../assets/images/uw-logo.png";

const Onboarding1 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/onboarding2");
  };

  return (
    <main
      className="bg-green-900 min-h-screen flex items-center justify-center"
      onClick={handleClick}
      aria-label="Onboarding screen 1"
    >
      <img src={uwLogo} alt="UW Logo" className="w-[204px] h-[229px]" />
    </main>
  );
};

export default Onboarding1;
