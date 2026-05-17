import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL,
  withCredentials: true
});
export default api;