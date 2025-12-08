import axios from "axios";

const api = axios.create({
    baseURL: "https://feac-backend.example/v1",
    timeout: 20000
});

// Token injector
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("feac_jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
