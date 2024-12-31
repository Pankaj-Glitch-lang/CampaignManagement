import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_HOST_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Set the Authorization token if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
