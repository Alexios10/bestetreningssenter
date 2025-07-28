import { API_BASE_URL, getHeaders, handleResponse } from "./apiConfig";
import { Rating } from "../types";

export const getRatingsByCenter = async (
  centerId: string
): Promise<Rating[]> => {
  const response = await fetch(`${API_BASE_URL}/ratings/center/${centerId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data as Rating[];
};

export const getUserRating = async (
  centerId: string,
  userId: string
): Promise<Rating | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ratings/center/${centerId}/user/${userId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (response.status === 404) {
      return null;
    }

    const data = await handleResponse(response);
    return data as Rating;
  } catch (error) {
    return null;
  }
};

export const addOrUpdateRating = async (
  centerId: string,
  rating: number
): Promise<Rating> => {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ centerId, rating }),
  });

  const data = await handleResponse(response);
  return data as Rating;
};

export const getAverageRating = async (centerId: string): Promise<number> => {
  const response = await fetch(
    `${API_BASE_URL}/ratings/center/${centerId}/average`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await handleResponse(response);
  return data.averageRating;
};

export const getAverageRatingsBatch = async (
  centerIds: string[]
): Promise<Record<string, number>> => {
  const params = new URLSearchParams();
  centerIds.forEach((id) => params.append("ids", id));
  const response = await fetch(
    `${API_BASE_URL}/ratings/centers/average?${params.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const data = await handleResponse(response);
  return data as Record<string, number>;
};

export const getUserRatingsBatch = async (
  centerIds: string[],
  userId: string
): Promise<Record<string, number>> => {
  const params = new URLSearchParams();
  centerIds.forEach((id) => params.append("ids", id));
  const response = await fetch(
    `${API_BASE_URL}/ratings/centers/user/${userId}?${params.toString()}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const data = await handleResponse(response);
  return data as Record<string, number>;
};
