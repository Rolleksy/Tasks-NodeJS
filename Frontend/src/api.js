import axios from 'axios';
// dotenv.config();
const apiPath = process.env.REACT_APP_API_PATH || 'http://localhost:5000';

const api = axios.create({
    baseURL: apiPath,
    headers: {
      'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
export default api;