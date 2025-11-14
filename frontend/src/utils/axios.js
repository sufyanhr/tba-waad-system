// javascript
import axios from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:9090/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('serviceToken');
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && !window.location.href.includes('/login')) {
            localStorage.removeItem('serviceToken');
            window.location.pathname = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosServices;

export const fetcher = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosServices.get(url, { ...config });
    return res.data;
};

export const fetcherPost = async (args) => {
    const [url, bodyOrConfig] = Array.isArray(args) ? args : [args];
    const { data, ...config } = bodyOrConfig || {};
    const res = await axiosServices.post(url, data ?? bodyOrConfig, { ...config });
    return res.data;
};
