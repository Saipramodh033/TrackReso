import axios from 'axios';

// axios url is customised for ease

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});
// here you bought a token from the local storage which is bought at the login time ;
// config is an object which represents the hhtp request , thourgh interceptor we are modifying it (add authorization header and inserting access token), after modifying you are return the request;

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;