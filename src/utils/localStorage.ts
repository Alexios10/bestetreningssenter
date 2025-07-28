
import { TrainingCenter, Rating } from "../types";

// Local storage keys
const CENTERS_KEY = "training-centers";
const RATINGS_KEY = "training-center-ratings";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get all training centers
export const getCenters = (): TrainingCenter[] => {
  const centers = localStorage.getItem(CENTERS_KEY);
  return centers ? JSON.parse(centers) : [];
};

// Add a training center
export const addCenter = (center: Omit<TrainingCenter, "id" | "createdAt" | "createdBy">): TrainingCenter => {
  const centers = getCenters();
  
  const newCenter: TrainingCenter = {
    ...center,
    id: generateId(),
    createdAt: Date.now(),
    createdBy: "user-1", // Simulating a user ID
  };
  
  localStorage.setItem(CENTERS_KEY, JSON.stringify([...centers, newCenter]));
  return newCenter;
};

// Update a training center
export const updateCenter = (center: TrainingCenter): TrainingCenter => {
  const centers = getCenters();
  const updatedCenters = centers.map(c => c.id === center.id ? center : c);
  localStorage.setItem(CENTERS_KEY, JSON.stringify(updatedCenters));
  return center;
};

// Delete a training center
export const deleteCenter = (id: string): void => {
  const centers = getCenters();
  const filteredCenters = centers.filter(center => center.id !== id);
  localStorage.setItem(CENTERS_KEY, JSON.stringify(filteredCenters));
  
  // Also remove all associated ratings
  const ratings = getRatings();
  const filteredRatings = ratings.filter(rating => rating.centerId !== id);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(filteredRatings));
};

// Get all ratings
export const getRatings = (): Rating[] => {
  const ratings = localStorage.getItem(RATINGS_KEY);
  return ratings ? JSON.parse(ratings) : [];
};

// Add a rating
export const addRating = (centerId: string, rating: number): Rating => {
  const ratings = getRatings();
  
  // Check if user already rated this center
  const existingRatingIndex = ratings.findIndex(
    r => r.centerId === centerId && r.userId === "user-1"
  );
  
  const newRating: Rating = {
    id: generateId(),
    centerId,
    rating,
    userId: "user-1", // Simulating a user ID
    createdAt: Date.now(),
  };
  
  if (existingRatingIndex >= 0) {
    // Update existing rating
    ratings[existingRatingIndex] = newRating;
  } else {
    // Add new rating
    ratings.push(newRating);
  }
  
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  return newRating;
};

// Get average rating for a center
export const getAverageRating = (centerId: string): number => {
  const ratings = getRatings();
  const centerRatings = ratings.filter(rating => rating.centerId === centerId);
  
  if (centerRatings.length === 0) {
    return 0;
  }
  
  const sum = centerRatings.reduce((total, rating) => total + rating.rating, 0);
  return Math.round((sum / centerRatings.length) * 10) / 10; // Round to 1 decimal
};

// Get user's rating for a center
export const getUserRating = (centerId: string): number | null => {
  const ratings = getRatings();
  const userRating = ratings.find(
    rating => rating.centerId === centerId && rating.userId === "user-1"
  );
  
  return userRating ? userRating.rating : null;
};

// Delete a rating
export const deleteRating = (id: string): void => {
  const ratings = getRatings();
  const filteredRatings = ratings.filter(rating => rating.id !== id);
  localStorage.setItem(RATINGS_KEY, JSON.stringify(filteredRatings));
};
