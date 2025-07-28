import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../api/authService";

// Keep existing User type
export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setToken: (token: string) => Promise<void>;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for auth token on initial load
  useEffect(() => {
    const validateAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          // Validate token with backend
          const userData = await authService.validateToken();
          setUser(userData);
        } catch (error) {
          // Invalid token
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }

      setLoading(false);
    };

    validateAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login(email, password);

      localStorage.setItem("authToken", token);
      setUser(user);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { token, user } = await authService.register(name, email, password);

      localStorage.setItem("authToken", token);
      setUser(user);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  // Add setToken function
  const setToken = async (token: string) => {
    localStorage.setItem("authToken", token);
    await fetchUser();
  };

  // Add fetchUser function
  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await authService.validateToken();
      setUser(userData);
    } catch {
      setUser(null);
      localStorage.removeItem("authToken");
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        setToken,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
