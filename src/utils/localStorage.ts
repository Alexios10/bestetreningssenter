import { TrainingCenter, Rating } from "../types";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all training centers
export const getCenters = async (): Promise<TrainingCenter[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trainingcenters`);
    return response.data;
  } catch (error) {
    console.error("Error fetching centers:", error);
    return [];
  }
};

// Add a training center
// export const addCenter = async (
//   center: Omit<TrainingCenter, "id" | "createdAt" | "createdBy">
// ): Promise<TrainingCenter> => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/trainingcenters`,
//       center
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error adding center:", error);
//     throw error;
//   }
// };

// Update a training center
// export const updateCenter = async (
//   center: TrainingCenter
// ): Promise<TrainingCenter> => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}/trainingcenters/${center.id}`,
//       center
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating center:", error);
//     throw error;
//   }
// };

// Delete a training center
// export const deleteCenter = async (id: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_BASE_URL}/trainingcenters/${id}`);
//   } catch (error) {
//     console.error("Error deleting center:", error);
//     throw error;
//   }
// };

// Get ratings
export const getRatings = async (centerId: string): Promise<Rating[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ratings/center/${centerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return [];
  }
};

// Add rating
export const addRating = async (
  centerId: string,
  rating: number
): Promise<Rating> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ratings`, {
      centerId,
      rating,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

// Get average rating
export const getAverageRating = async (centerId: string): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ratings/center/${centerId}/average`
    );
    return response.data.averageRating;
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return 0;
  }
};
