import { toast } from '../notify/ToastBus';
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

// AUTO ERROR PIPELINE → convert all API errors into toast notifications
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Unknown FEAC API Error";

        toast(msg, "error");
        return Promise.reject(err);
    }
);
