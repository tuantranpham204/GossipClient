import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_URL}${import.meta.env.VITE_API_V1_SERVER}`,
});

export default apiClient;
