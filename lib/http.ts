import axios from 'axios';

const api = axios.create({
    // Prefer explicit NEXT_PUBLIC_API_URL; fallback to API_PROXY_TARGET used locally; else default to backend localhost
    baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.API_PROXY_TARGET || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('asiou_jwt') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;