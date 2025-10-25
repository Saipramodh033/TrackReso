import axios from 'axios';

// axios url is customised for ease

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// here you bought a token from the local storage which is bought at the login time ;
// config is an object which represents the hhtp request , thourgh interceptor we are modifying it (add authorization header and inserting access token), after modifying you are return the request;

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        console.log('API Request:', config.method.toUpperCase(), config.url);
        console.log('Token found:', token ? 'Yes' : 'No');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set');
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
        return Promise.reject(error);
    }
);

export default api;