import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER}`,
});

export default apiClient;
