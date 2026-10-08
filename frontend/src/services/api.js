import axios from "axios";

console.log("API.JS LOADED")
// Base URL for our Django backend
const api = axios.create ({
    baseURL : "http://127.0.0.1:8000/api/",
    headers : {
        "Content-Type" : "application/json",
    }
})

// Automaticlly attach the jwt access token to every protectec request.
api.interceptors.request.use(
    (config) => {
        // Get the JWT access token from the browser.
        const token = localStorage.getItem("access_token");

        // Show whether the token exists.
        console.log("JWT token exists:", !!token);

        // Attach the token to protected Django requests.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Show the Authorization header being sent.
        console.log("Authorization header:", config.headers.Authorization);

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);
export default api