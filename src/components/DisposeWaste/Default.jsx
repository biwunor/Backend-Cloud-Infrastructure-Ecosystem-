// Component: Default (Dispose Waste)
// Purpose: Allows users to select waste disposal preferences.
// - Provides a form with options for waste type and collection method.
// - Submits the selected preferences to schedule a waste pickup.

// This page displays the default empty waste disposal drop-down options form for the user. It includes a list of waste categories, a preview selection, and a personalization option. The user can select their state to see the relevant waste disposal options.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UwLogo from "../../assets/images/uw-logo2.png";
import { HiOutlineMenu } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";

const Default = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [wasteCategory, setWasteCategory] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [collectionMethod, setCollectionMethod] = useState("");

  const isFormComplete =
    state !== "" &&
    wasteCategory !== "" &&
    wasteType !== "" &&
    collectionMethod !== "";

  function handleDispose() {
    if (isFormComplete) {
      navigate("/homepage");
    }
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="flex justify-between items-center p-4">
        <div>
          <img src={UwLogo} alt="UW Logo" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </div>
        <button className="cursor-pointer">
          <HiOutlineMenu className="w-6 h-6 text-black opacity-70 sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </button>
      </div>

      <div className="p-4">
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold mb-3 sm:text-3xl md:text-4xl">Dispose Waste</h1>
          <p className="text-lg text-neutral-500 sm:text-xl md:text-2xl">
            Let’s set up your waste disposal preferences
          </p>
        </div>

        <div className="mt-20">
          <div className="mb-4">
            <Select onValueChange={(value) => setState(value)}>
              <SelectTrigger
                id="state"
                className="w-full"
                aria-label="Select your state"
              >
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-5 h-5 text-neutral-500 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                      <span className="text-neutral-500 sm:text-base md:text-lg">Enter location</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-auto max-w-md">
                <SelectGroup>
                  <SelectLabel className="text-black font-semibold border-b border-zinc-600 pb-2">
                    States Available
                  </SelectLabel>
                  <SelectItem value="abuja" className="text-black">
                    Abuja
                  </SelectItem>
                  <SelectItem value="lagos" className="text-black">
                    Lagos
                  </SelectItem>
                  <SelectItem value="port-harcourt" className="text-black">
                    Port Harcourt
                  </SelectItem>
                  <SelectItem value="calabar" className="text-black">
                    Calabar
                  </SelectItem>
                  <SelectItem value="delta" className="text-black">
                    Delta
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Select onValueChange={(value) => setWasteCategory(value)}>
              <SelectTrigger
                id="waste-category"
                className="w-full"
                aria-label="Select waste category"
              >
                <SelectValue
                  placeholder={
                    <span className="text-neutral-500 sm:text-base md:text-lg">
                      Select waste category
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-auto max-w-md">
                <SelectGroup>
                  <SelectLabel className="text-black font-semibold border-b border-zinc-600 pb-2">
                    Waste Category
                  </SelectLabel>
                  <SelectItem value="chemical" className="text-black">
                    Chemical Waste
                  </SelectItem>
                  <SelectItem value="toxic" className="text-black">
                    Toxic Waste
                  </SelectItem>
                  <SelectItem value="commercial" className="text-black">
                    Commercial Waste
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Select onValueChange={(value) => setWasteType(value)}>
              <SelectTrigger
                id="waste-type"
                className="w-full"
                aria-label="Select waste type"
              >
                <SelectValue
                  placeholder={
                    <span className="text-neutral-500 sm:text-base md:text-lg">
                      What type of waste do you want to dispose?
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-auto max-w-md">
                <SelectGroup>
                  <SelectLabel className="text-black font-semibold border-b border-zinc-600 pb-2">
                    Waste Type
                  </SelectLabel>
                  <SelectItem value="personal" className="text-black">
                    Personal Waste
                  </SelectItem>
                  <SelectItem value="office" className="text-black">
                    Office Waste
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Select onValueChange={(value) => setCollectionMethod(value)}>
              <SelectTrigger
                id="collection-method"
                className="w-full"
                aria-label="Select collection method"
              >
                <SelectValue
                  placeholder={
                    <span className="text-neutral-500 sm:text-base md:text-lg">
                      Preferred collection method
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-auto max-w-md">
                <SelectGroup>
                  <SelectLabel className="text-black font-semibold border-b border-zinc-600 pb-2">
                    Collection Method
                  </SelectLabel>
                  <SelectItem value="collection-center" className="text-black">
                    Collection Center
                  </SelectItem>
                  <SelectItem value="doorstep" className="text-black">
                    Doorstep
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleDispose}
            className={`w-full py-2 px-4 rounded-full text-white font-semibold mt-20 sm:py-3 sm:px-6 md:py-4 md:px-8 ${
              isFormComplete
                ? "bg-green-800 border-green-800 cursor-pointer"
                : "bg-neutral-400 border-neutral-400 cursor-not-allowed"
            }`}
            disabled={!isFormComplete}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Default;
