import axios from 'axios';
import { toast } from 'react-toastify';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10000, // Timeout de 10 segundos
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

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    // Adicionar token de autenticação se disponível
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Verificar se é um erro de rede (servidor indisponível)
    if (!error.response) {
      toast.error('Erro de conexão. Verifique sua internet e se o servidor está rodando.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return Promise.reject(error);
    }

    // Tratar erros específicos
    switch (error.response.status) {
      case 429: // Rate limit
        toast.error('Muitas requisições. Por favor, aguarde um momento antes de tentar novamente.', {
          position: 'top-right',
          autoClose: 5000,
        });
        break;
      
      case 403: // CSRF error
        if (error.response.data.error === 'invalid_csrf_token') {
          toast.error('Erro de segurança. Recarregando a página para obter um novo token.', {
            position: 'top-right',
            autoClose: 3000,
            onClose: () => window.location.reload()
          });
        }
        break;
      
      case 401: // Authentication error
        // Se o token expirou, tentar renovar
        if (error.response.data.error === 'token_expired' || 
            error.response.data.message === 'Token expirado') {
          try {
            const refreshResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            
            if (refreshResponse.data.token) {
              // Atualizar token no localStorage
              localStorage.setItem('token', refreshResponse.data.token);
              
              // Reenviar a requisição original com o novo token
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Se falhar ao renovar o token, redirecionar para login
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        break;
      
      case 500:
        toast.error('Erro no servidor. Por favor, tente novamente mais tarde.', {
          position: 'top-right',
          autoClose: 5000,
        });
        break;
    }

    return Promise.reject(error);
  }
);

export default api; 