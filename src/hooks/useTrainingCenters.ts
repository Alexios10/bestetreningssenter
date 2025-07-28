import { useState, useEffect, useCallback } from "react";
import { TrainingCenter } from "../types";
import { getTrainingCenters } from "../api/trainingCenterService";
import {
  getAverageRatingsBatch,
  getUserRatingsBatch,
  addOrUpdateRating,
} from "../api/ratingService";
import { useAuth } from "../contexts/AuthContext";

export const useTrainingCenters = () => {
  const [centers, setCenters] = useState<TrainingCenter[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [averageRatings, setAverageRatings] = useState<Record<string, number>>(
    {}
  );
  const [userRatings, setUserRatings] = useState<Record<string, number | null>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch centers and ratings
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Get all centers
      const loadedCenters = await getTrainingCenters();
      const centersArray = Array.isArray(loadedCenters) ? loadedCenters : [];
      setCenters(centersArray);

      const centerIds = centersArray.map((center) => center.id);
      let avgRatings: Record<string, number> = {};
      let usrRatings: Record<string, number | null> = {};

      // Batch endpoints for ratings
      if (centerIds.length > 0) {
        avgRatings = await getAverageRatingsBatch(centerIds);
        if (user) {
          usrRatings = await getUserRatingsBatch(centerIds, user.id);
        } else {
          centerIds.forEach((id) => {
            usrRatings[id] = null;
          });
        }
      }

      setAverageRatings(avgRatings);
      setUserRatings(usrRatings);
    } catch (error) {
      console.error("Failed to load training centers:", error);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load data on initial render and when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // You mentioned centers are managed in the database only
  const handleAddCenter = () => {
    // This functionality is not needed as you'll manage centers directly in pgAdmin
    console.warn("Adding centers from the frontend is disabled");
  };

  // Delete functionality is also likely not needed
  const handleDeleteCenter = () => {
    console.warn("Deleting centers from the frontend is disabled");
  };

  const handleRateCenter = async (centerId: string, rating: number) => {
    try {
      if (!user) {
        return;
      }

      await addOrUpdateRating(centerId, rating);

      // Update the local state
      setAverageRatings((prev) => ({
        ...prev,
        [centerId]: prev[centerId] || 0, // Keep previous average until refetch
      }));

      setUserRatings((prev) => ({
        ...prev,
        [centerId]: rating,
      }));

      // Refresh average rating for this center
      const newAverage = await getAverageRatingsBatch([centerId]);
      setAverageRatings((prev) => ({
        ...prev,
        [centerId]: newAverage[centerId] || 0,
      }));
    } catch (error) {
      console.error("Failed to rate center:", error);
    }
  };

  return {
    centers,
    averageRatings,
    userRatings,
    loading,
    showAddForm,
    setShowAddForm,
    handleAddCenter,
    handleRateCenter,
    handleDeleteCenter,
    refreshData: loadData,
  };
};
