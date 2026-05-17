import React, { createContext, useState, useContext, useEffect } from "react";

import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load User From LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN DATA:", data);

      // Save Token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Create User Object
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };

      // Save User
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      return userData;
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);

      throw error;
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("REGISTER DATA:", data);

      // Save Token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Create User Object
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };

      // Save User
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      return userData;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export const useAuth = () => useContext(AuthContext);
