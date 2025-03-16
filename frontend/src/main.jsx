import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'

// Criar cliente do React Query com configurações
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Não recarregar dados quando a janela ganha foco
      retry: 1, // Tentar novamente apenas uma vez em caso de erro
      staleTime: 5 * 60 * 1000, // Dados considerados "frescos" por 5 minutos
      cacheTime: 10 * 60 * 1000, // Manter dados em cache por 10 minutos
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
