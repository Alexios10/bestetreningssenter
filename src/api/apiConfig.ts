/**
 * Base configuration for API requests
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get stored auth token if available
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Default request headers
export function getHeaders() {
  const token = localStorage.getItem("authToken");
  // If no token is found, return headers without Authorization
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Error handling for fetch responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // get error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (error) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  // Check if response is empty
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};
