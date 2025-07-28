import { API_BASE_URL, getHeaders, handleResponse } from "./apiConfig";
import { TrainingCenter } from "../types";

export const getTrainingCenters = async (): Promise<TrainingCenter[]> => {
  const response = await fetch(`${API_BASE_URL}/trainingcenters`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data as TrainingCenter[];
};

export const getTrainingCenterById = async (
  centerId: string
): Promise<TrainingCenter> => {
  const response = await fetch(`${API_BASE_URL}/trainingcenters/${centerId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data as TrainingCenter;
};
