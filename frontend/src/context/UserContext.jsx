import { createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../api";

export const userDataContext = createContext();

function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // Use relative URLs (Vite proxy routes `/api` to backend). Keeps cookies same-origin in dev.
  const apiBase = "";

  const handleCurrentUser = async () => {
    try {
      // If cookie-based auth isn't present, fallback to Authorization header using token saved in localStorage
      const res = await api.get(`/api/user/current`);

      setUserData(res.data.user);
      console.log("CURRENT USER:", res.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserData(null);
    }
  };

  // Send a command to the assistant (backend will run gemini and return parsed response)
  const getGeminiResponse = async (command) => {
    try {
      const res = await api.post(`/api/user/ask`, { command });
      return res.data;
    } catch (error) {
      console.error("getGeminiResponse error:", error?.response?.data || error.message);
      return { response: "Assistant error" };
    }
  };

  useEffect(() => {
    // Only try to fetch current user if a token exists (cookie or localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      handleCurrentUser();
    }
  }, []);

  return (
    <userDataContext.Provider
      value={{
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse,
      }}
    >
      {children}
    </userDataContext.Provider>
  );
}

export default UserContextProvider;
