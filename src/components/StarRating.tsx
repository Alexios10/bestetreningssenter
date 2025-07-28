import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  onRatingChange,
  interactive = false,
}) => {
  const getRatingDescription = (rating: number): string => {
    if (rating === 0) return "";
    if (rating <= 1) return "Verst";
    if (rating <= 2) return "Dårlig";
    if (rating <= 3) return "OK";
    if (rating <= 4) return "bra";
    return "Veldig bra";
  };

  const handleStarClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      // Toggle rating if clicking the same star again
      if (rating === selectedRating) {
        onRatingChange(0);
      } else {
        onRatingChange(selectedRating);
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          className={`focus:outline-none ${
            interactive ? "cursor-pointer" : "cursor-default"
          }`}
          disabled={!interactive}
        >
          <Star
            fill={star <= rating ? "#F59E0B" : "transparent"}
            color={star <= rating ? "#F59E0B" : "#CBD5E1"}
            size={size}
            className={
              interactive ? "transition-all duration-200 hover:scale-110" : ""
            }
          />
        </button>
      ))}

      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-700 font-medium">
          {getRatingDescription(rating)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
