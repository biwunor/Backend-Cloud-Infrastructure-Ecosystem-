import React from "react";

export const Avatar = ({ children, className }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className || ""}`}
    />
  );
};

export const AvatarFallback = ({ children, className }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-800 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};