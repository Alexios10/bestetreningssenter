import { API_BASE_URL, getHeaders, handleResponse } from "./apiConfig";
import { User } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "sonner";

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { headers: getHeaders() }
  );
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      Name: name,
      Email: email,
      Password: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  const result = await response.json();
  return result;
};

export const validateToken = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.user;
};

export const handleResendConfirmation = async (email: string) => {
  try {
    await fetch(`${API_BASE_URL}/auth/resend-confirmation`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    toast.success("Confirmation email resent. Please check your inbox.");
  } catch {
    toast.error("Could not resend confirmation email.");
  }
};
