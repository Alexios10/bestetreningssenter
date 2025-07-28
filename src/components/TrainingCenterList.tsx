import React, { useState, useEffect } from "react";
import TrainingCenterCard from "./TrainingCenterCard";
import { TrainingCenter } from "../types";

interface TrainingCenterListProps {
  centers: TrainingCenter[];
  averageRatings: Record<string, number>;
  userRatings: Record<string, number | null>;
  onRate: (centerId: string, rating: number) => void;
  onDelete: (centerId: string) => void;
}

const TrainingCenterList: React.FC<TrainingCenterListProps> = ({
  centers,
  averageRatings: initialAverageRatings,
  userRatings: initialUserRatings,
  onRate,
  onDelete,
}) => {
  const [localAverageRatings, setLocalAverageRatings] = useState(
    initialAverageRatings
  );
  const [localUserRatings, setLocalUserRatings] = useState(initialUserRatings);

  const handleRate = async (centerId: string, rating: number) => {
    await onRate(centerId, rating);
    // Update local state immediately
    setLocalUserRatings((prev) => ({
      ...prev,
      [centerId]: rating,
    }));

    // Calculate and update new average
    const currentAverage = localAverageRatings[centerId] || 0;
    const newAverage =
      (currentAverage * Object.keys(localUserRatings).length + rating) /
      (Object.keys(localUserRatings).length + 1);
    setLocalAverageRatings((prev) => ({
      ...prev,
      [centerId]: newAverage,
    }));
  };

  if (centers.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-medium text-gray-600 mb-2">
          Ingen treningssentre funnet
        </h3>
        <p className="text-gray-500">
          Prøv å justere filtrene eller søkekriteriene dine
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {centers.map((center, index) => (
        <div
          key={center.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <TrainingCenterCard
            center={center}
            averageRating={localAverageRatings[center.id] || 0}
            userRating={localUserRatings[center.id] || null}
            onRate={(rating) => handleRate(center.id, rating)}
            onDelete={() => onDelete(center.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default TrainingCenterList;
