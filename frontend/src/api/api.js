import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// REQUEST INTERCEPTOR: Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 (Session Expired/Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const isLoginPage = window.location.pathname === "/login";
      const isAuthEndpoint = originalRequest.url.includes("/auth/login");

      // Clear user state
      useAuthStore.getState().logout();

      // Only notify and redirect if we're not already on the login flow
      if (!isLoginPage && !isAuthEndpoint) {
        window.alert("Session expired, please login again");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
