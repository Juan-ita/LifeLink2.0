import axios from "axios";

// Base URL for our Django backend
const BASE_URL = "http://127.0.0.1:8001/api/";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Requests a new access token when the current one expires.
const refreshApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the access token to every protected API request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Automatically refresh an expired access token.
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Only handle unauthorized responses, and retry each request once.
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("token/") &&
            !originalRequest.url?.includes("token/refresh/")
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            // If there is no refresh token, the user must log in again.
            if (!refreshToken) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_role");

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {
                // Ask Django for a new access token.
                const response = await refreshApi.post("token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;

                // Save the new token for future requests.
                localStorage.setItem("access_token", newAccessToken);

                // Retry the original request using the new token.
                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                // If refreshing fails, the refresh token may also have expired.
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user_role");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;