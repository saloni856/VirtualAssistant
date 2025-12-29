import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

// attach Authorization: Bearer <token> if token exists
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
