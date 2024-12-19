import axios from 'axios';
import { useAuth } from '../../Context/AuthContext'; 

const createHttpClient = (getToken) => {
  // Create an axios instance
  const httpClient = axios.create({
    baseURL: 'https://nuclios-gen-ai-dev.mathco.com/comments-backend/', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor
  httpClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Authentication error, please login', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('Unauthorized, redirecting to login...');
      }
      return Promise.reject(error);
    }
  );

  return httpClient;
};

export const useHttpClient = () => {
  const { getToken } = useAuth();
  return createHttpClient(getToken);
};
