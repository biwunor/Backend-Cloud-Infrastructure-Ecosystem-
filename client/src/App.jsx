import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Import SplashScreen components
import Onboarding1 from "./components/SplashScreen/Onboarding1";
import Onboarding2 from "./components/SplashScreen/Onboarding2";
import Onboarding3 from "./components/SplashScreen/Onboarding3";

// Import Authentication components
import Register from "./components/authentication/Register";
import SignUpAs from "./components/authentication/SignUpAs";
import Login from "./components/authentication/Login";

// Import Dashboard components
import Homepage from "./components/Dashboard/Homepage";

// Import DisposeWaste components
import Default from "./components/DisposeWaste/Default";

const App = () => {
  // State to determine if the app has already been launched
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  // Check if the app has been launched before
  useEffect(() => {
    const hasLaunched = localStorage.getItem("hasLaunched");
    if (hasLaunched === "true") {
      setIsFirstLaunch(false);
    }
  }, []);

  // Set hasLaunched to true in localStorage
  const handleFinishOnboarding = () => {
    localStorage.setItem("hasLaunched", "true");
    setIsFirstLaunch(false);
  };

  return (
    <div className="App">
      <Routes>
        {/* Route for onboarding screens */}
        <Route path="/" element={isFirstLaunch ? <Onboarding1 /> : <Login />} />
        <Route path="/onboarding2" element={<Onboarding2 />} />
        <Route 
          path="/onboarding3" 
          element={<Onboarding3 handleFinishOnboarding={handleFinishOnboarding} />} 
        />

        {/* Route for authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-up-as" element={<SignUpAs />} />

        {/* Route for dashboard */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Route for waste disposal */}
        <Route path="/default" element={<Default />} />

        {/* Redirect to homepage for any undefined routes */}
        <Route path="*" element={isFirstLaunch ? <Onboarding1 /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;