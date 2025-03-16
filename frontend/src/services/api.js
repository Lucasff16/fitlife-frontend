import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Variável para armazenar o token CSRF
let csrfToken = null;

// Função para buscar o token CSRF
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/csrf-token');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Erro ao buscar CSRF token:', error);
    return null;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    // Adicionar CSRF token para métodos que modificam dados
    const methodsRequiringCsrf = ['post', 'put', 'delete', 'patch'];
    if (methodsRequiringCsrf.includes(config.method) && !csrfToken) {
      try {
        await fetchCsrfToken();
      } catch (error) {
        console.error('Não foi possível obter o token CSRF:', error);
      }
    }

    if (csrfToken && methodsRequiringCsrf.includes(config.method)) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 