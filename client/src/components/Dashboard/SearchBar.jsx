import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { MdTune } from "react-icons/md";

const SearchBar = () => {
  return (
    <div className="p-4 flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      <div className="flex items-center rounded-md bg-gray-100 flex-1 p-2 sm:p-3 md:p-4">
        <HiOutlineSearch className="w-5 h-5 text-zinc-700 ml-2 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 outline-none rounded-md placeholder-zinc-700 bg-transparent px-4 sm:px-6 md:px-8"
        />
      </div>
      <MdTune className="w-7 h-7 cursor-pointer text-zinc-700 sm:w-8 sm:h-8 md:w-9 md:h-9" />
    </div>
  );
};

export default SearchBar;
