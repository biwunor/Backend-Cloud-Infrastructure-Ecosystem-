import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../shared/Header";
import CompleteImage from "../../assets/images/complete.png";
import FooterNavBar from "../shared/FooterNavBar";
import { ClipLoader } from "react-spinners";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { FaChevronRight } from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails: initialUserDetails, phoneDetails: initialPhoneDetails } =
    location.state || {};

  const [userDetails, setUserDetails] = useState(
    initialUserDetails || {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
    }
  );
  const [phoneDetails, setPhoneDetails] = useState(
    initialPhoneDetails || {
      countryCode: "+234",
      phoneNumber: "",
    }
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <ClipLoader color="#065f46" size={50} />
        <p className="text-lg font-semibold mt-4 sm:text-xl md:text-2xl">Please hold on</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <img src={CompleteImage} alt="Success" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
        <p className="text-lg font-semibold mt-4 sm:text-xl md:text-2xl">Profile edit successfully</p>
        <button
          onClick={() => {
            setIsSuccess(false);
            navigate("/homepage");
          }}
          className="text-green-900 font-semibold underline mt-2 sm:text-lg md:text-xl"
        >
          Go back homepage
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setPhoneDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      localStorage.setItem("phoneDetails", JSON.stringify(phoneDetails));
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <Header />
      <div className="flex items-center justify-between mt-4">
        <FaArrowLeft
          className="w-4 h-4 text-black cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-center text-2xl font-semibold text-black flex-grow sm:text-3xl md:text-4xl">
          Edit Profile
        </h1>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4 sm:text-xl md:text-2xl">Basic Information</h2>
        <input
          type="text"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleInputChange}
          className="border border-neutral-300 rounded-lg px-4 py-2 w-full mb-4 sm:text-base md:text-lg"
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleInputChange}
          className="border border-neutral-300 rounded-lg px-4 py-2 w-full mb-4 sm:text-base md:text-lg"
          placeholder="Last Name"
        />
        <input
          type="text"
          name="address"
          value={userDetails.address}
          onChange={handleInputChange}
          className="border border-neutral-300 rounded-lg px-4 py-2 w-full mb-4 sm:text-base md:text-lg"
          placeholder="Address"
        />
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          className="border border-neutral-300 rounded-lg px-4 py-2 w-full mb-4 sm:text-base md:text-lg"
          placeholder="Email"
        />
        <input
          type="text"
          name="phoneNumber"
          value={phoneDetails.phoneNumber}
          onChange={handlePhoneChange}
          className="border border-neutral-300 rounded-lg px-4 py-2 w-full mb-4 sm:text-base md:text-lg"
          placeholder="Phone Number"
        />

        <button
          onClick={handleSaveClick}
          className="bg-green-800 text-white px-6 py-2 rounded-full font-semibold w-full sm:text-base md:text-lg hover:bg-green-700 transition-all"
        >
          Save
        </button>
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
            onCheckedChange={() => setIsNotificationEnabled(!isNotificationEnabled)}
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
    </div>
  );
};

export default EditProfile;
