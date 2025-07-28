import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const TokenHandler = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      navigate("/", { replace: true });
    }
  }, [setToken, navigate]);

  return null;
};

export default TokenHandler;
