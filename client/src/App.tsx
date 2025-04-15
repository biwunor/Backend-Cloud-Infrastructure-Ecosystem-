import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding1 from "./components/SplashScreen/Onboarding1";
import Onboarding2 from "./components/SplashScreen/Onboarding2";
import Onboarding3 from "./components/SplashScreen/Onboarding3";
import Register from "./components/Authentication/Register";
import SignUpAs from "./components/Authentication/SignUpAs";
import Login from "./components/Authentication/Login";
import Homepage from "./components/Dashboard/Homepage";
import Default from "./components/DisposeWaste/Default";
import Dashboard from "./components/Dashboard/Dashboard";
import PastWaste from "./components/Dashboard/PastWaste";
import Notifications from "./components/Dashboard/Notifications";
import UserProfile from "./components/Dashboard/UserProfile";
import Recycle from "./components/Dashboard/Recycle";
import EditProfile from "./components/Dashboard/EditProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding1 />} />
        <Route path="/onboarding2" element={<Onboarding2 />} />
        <Route path="/onboarding3" element={<Onboarding3 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signupas" element={<SignUpAs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/default" element={<Default />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pastWaste" element={<PastWaste />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/recycle" element={<Recycle />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
