import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleCallback } from "@/api/authService";

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const success = handleGoogleCallback(token);
      if (success) {
        navigate("/"); // or wherever you want to redirect after successful login
      } else {
        navigate("/login?error=AuthFailed");
      }
    } else {
      navigate("/login?error=NoToken");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
};
