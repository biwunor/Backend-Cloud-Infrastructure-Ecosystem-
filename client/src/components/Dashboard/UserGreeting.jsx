import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserGreeting = () => {
  return (
    <div className="p-4 flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {/* Avatar Component */}
      <div className="mr-4">
        <Avatar className="w-15 h-15 sm:w-20 sm:h-20 md:w-24 md:h-24">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="User Avatar"
          />
          <AvatarFallback className="text-sm sm:text-base md:text-lg">JD</AvatarFallback>
        </Avatar>
      </div>

      <div>
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">Hello, John Doe</h1>
        <p className="text-sm text-gray-600 sm:text-base md:text-lg">How are you today?</p>
      </div>
    </div>
  );
};

export default UserGreeting;