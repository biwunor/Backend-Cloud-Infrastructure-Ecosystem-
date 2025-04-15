import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../shared/Header";
import FooterNavBar from "../shared/FooterNavBar";
import { FaArrowLeft, FaChevronRight, FaCircleNotch } from "react-icons/fa";
import { MdOutlineCameraAlt } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import CompleteImage from "../../assets/images/complete.png";
import EditProfile from "./EditProfile";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [userDetails] = useState({
    name: "Courtney Henry",
    address: "2118 Thornridge Cir. Syracuse 35624",
    email: "georgia.young@example.com",
  });
  const [phoneDetails] = useState({
    countryCode: "+234",
    phoneNumber: "",
  });
  const [isLoading] = useState(false);

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

  const handleNotificationToggle = () => {
    setIsNotificationEnabled((prev) => {
      const newValue = !prev;
      console.log(
        newValue ? "Notifications enabled" : "Notifications disabled"
      );
      return newValue;
    });
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <FaCircleNotch
            className="w-16 h-16 animate-spin sm:w-20 sm:h-20 md:w-24 md:h-24"
            style={{
              background: "linear-gradient(to right, #065f46, #16a34a)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          />
          <p className="text-lg font-semibold mt-4 sm:text-xl md:text-2xl">Please hold on</p>
        </div>
      )}

      {!isLoading && (
        <>
          <Header />
          <div className="flex items-center justify-between mt-4">
            <FaArrowLeft
              className="w-4 h-4 text-black cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6"
              onClick={handleBackClick}
            />
            <h1 className="text-center text-2xl font-semibold text-black flex-grow sm:text-3xl md:text-4xl">
              Profile
            </h1>
          </div>

          <div className="flex flex-col items-start mt-6">
            <div className="relative">
              <img
                src="https://github.com/shadcn.png"
                alt="Profile"
                className="w-15 h-15 rounded-full object-cover sm:w-20 sm:h-20 md:w-24 md:h-24"
              />
              <div
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer sm:p-2 md:p-3"
                onClick={() =>
                  document.getElementById("profile-upload").click()
                }
              >
                <MdOutlineCameraAlt className="text-green-900 text-md sm:text-lg md:text-xl" />
              </div>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) =>
                  console.log("Profile picture uploaded:", e.target.files[0])
                }
              />
            </div>
            <div className="flex items-center justify-between w-full mt-4">
              <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">{userDetails.name}</h2>
              <button
                onClick={() => {
                  navigate("/edit-profile", {
                    state: { userDetails, phoneDetails },
                  });
                }}
                className="flex items-center text-green-900 text-base font-semibold underline sm:text-lg md:text-xl"
              >
                <FiEdit2 className="mr-1 text-lg sm:text-xl md:text-2xl" /> Edit
              </button>
            </div>
            <p className="text-sm text-black font-semibold sm:text-base md:text-lg">
              {userDetails.address}
            </p>
            <p className="text-sm text-black font-semibold sm:text-base md:text-lg">
              {userDetails.email}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-sm font-bold text-black flex items-center sm:text-base md:text-lg">
                Active Pickup
                <span className="w-3 h-3 bg-green-900 rounded-full ml-3"></span>
              </h3>
            </div>
            <hr className="border-stone-300 my-3" />
            <p className="text-sm text-black font-semibold mt-4 sm:text-base md:text-lg">
              Scheduled pickup request
            </p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-black font-semibold mt-4 sm:text-base md:text-lg">
                Live Status updates
              </p>
              <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full mt-4 sm:text-sm md:text-base">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-black font-semibold mt-4 sm:text-base md:text-lg">
                Cancel Pickup
              </p>
              <FaChevronRight className="text-black mt-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>

            <div className="flex items-center justify-between mt-4">
              <Label
                htmlFor="allow-notification"
                className="text-sm text-black font-semibold mt-4 sm:text-base md:text-lg"
              >
                Allow notification
              </Label>
              <Switch
                id="allow-notification"
                checked={isNotificationEnabled}
                onCheckedChange={handleNotificationToggle}
                className="toggle-checkbox cursor-pointer mt-4 scale-125"
              />
            </div>
          </div>

          <div className="mt-6 pb-10">
            <hr className="border-stone-300 my-3" />
            <div className="mt-4">
              <p className="text-sm text-black font-semibold mt-4 sm:text-base md:text-lg">Support</p>
            </div>
            <hr className="border-stone-300 my-3" />
            <div className="mt-4">
              <p className="text-sm text-black font-semibold sm:text-base md:text-lg">Logout</p>
            </div>
          </div>

          <FooterNavBar />
        </>
      )}
    </div>
  );
};

export default UserProfile;
