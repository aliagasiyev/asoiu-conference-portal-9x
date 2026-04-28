import axios from 'axios';

const api = axios.create({
    // If NEXT_PUBLIC_API_URL is provided, hit it directly.
    // Otherwise, fallback to '' (relative), allowing Nginx or Next.js to proxy the request.
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('asiou_jwt') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Automatically log out user if token is expired or invalid
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Only auto-logout if this is NOT a login attempt
            // Login failures should be handled by the calling component
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            
            if (!isLoginRequest && typeof window !== 'undefined') {
                localStorage.removeItem('asiou_jwt');
                localStorage.removeItem('asiou_user_email');
                window.location.reload(); // Force app to remount into 'login' state
            }
        }
        return Promise.reject(error);
    }
);

export default api;