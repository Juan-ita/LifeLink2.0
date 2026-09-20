import axios from "axios";

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
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)
export default api