import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ThumbsUpIcon from "../../assets/images/thumbs-up.png";

const RatingDialog = ({
  isDialogOpen,
  handleDialogClose,
  handleRating,
  rating,
  isRated,
}) => (
  <AlertDialog open={isDialogOpen} onOpenChange={handleDialogClose}>
    <AlertDialogContent
      className="w-full max-w-md p-6 -mt-20 bg-white border border-white sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      aria-describedby="rating-dialog-description"
    >
      <AlertDialogHeader>
        <div className="flex flex-col items-center">
          <img
            src={ThumbsUpIcon}
            alt="Thumbs Up"
            className="w-24 h-24 mb-4 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          <AlertDialogTitle className="text-lg sm:text-xl md:text-2xl">
            {isRated ? "Thank you for your rating" : "Rate this service"}
          </AlertDialogTitle>
        </div>
      </AlertDialogHeader>
      <AlertDialogDescription
        id="rating-dialog-description"
        className="text-center text-sm sm:text-base md:text-lg"
      >
        {isRated
          ? "We appreciate your feedback. Your rating helps us improve our service."
          : "Please provide your rating for the service you received."}
      </AlertDialogDescription>
      {!isRated && (
        <div className="flex justify-center mt-4 gap-2 sm:gap-3 md:gap-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} onClick={() => handleRating(star)}>
              {star <= rating ? (
                <AiFillStar className="cursor-pointer text-2xl text-yellow-500 sm:text-3xl md:text-4xl" />
              ) : (
                <AiOutlineStar className="cursor-pointer text-2xl text-gray-300 sm:text-3xl md:text-4xl" />
              )}
            </span>
          ))}
        </div>
      )}
      <AlertDialogFooter className="flex justify-center items-center mt-4">
        <button
          onClick={handleDialogClose}
          className="px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-800 sm:px-6 sm:py-3 md:px-8 md:py-4"
        >
          Close
        </button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RatingDialog;
