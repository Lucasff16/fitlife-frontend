import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestConnection() {
  const [status, setStatus] = useState('Verificando conexão...');
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [serverInfo, setServerInfo] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [serverPort, setServerPort] = useState(null);
  const [serverEnvironment, setServerEnvironment] = useState(null);

  const testConnection = async () => {
    setStatus('Verificando conexão...');
    setError('');
    setDetailedError(null);
    setServerInfo(null);
    setServerPort(null);
    setServerEnvironment(null);
    
    // Obter a URL da API do arquivo .env
    const url = import.meta.env.VITE_API_URL || '/api';
    setApiUrl(url);
    
    try {
      // Tentar fazer uma requisição direta para a rota de teste
      const response = await axios.get(`${url}/test`, { timeout: 5000 });
      
      setStatus('Conectado com sucesso!');
      setServerInfo({
        message: response.data.message,
        timestamp: response.data.timestamp,
        success: response.data.success
      });
      
      // Extrair a porta do servidor da URL e da resposta
      const portMatch = url.match(/:(\d+)/);
      if (portMatch && portMatch[1]) {
        setServerPort(portMatch[1]);
      } else if (response.data.serverInfo && response.data.serverInfo.port) {
        setServerPort(response.data.serverInfo.port);
      }
      
      // Armazenar o ambiente do servidor
      if (response.data.serverInfo && response.data.serverInfo.environment) {
        setServerEnvironment(response.data.serverInfo.environment);
      }
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
      setStatus('Falha na conexão');
      
      // Analisar o tipo de erro para fornecer mensagens mais úteis
      if (err.response) {
        // O servidor respondeu com um status de erro
        setError(`Erro ${err.response.status}: ${err.response.data.message || JSON.stringify(err.response.data)}`);
        setDetailedError({
          type: 'Resposta do servidor com erro',
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        });
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        setError('Não foi possível conectar ao servidor. Verifique se o servidor está rodando e se a URL está correta.');
        setDetailedError({
          type: 'Sem resposta do servidor',
          message: 'O servidor não respondeu dentro do tempo limite',
          request: {
            url: err.config.url,
            method: err.config.method,
            timeout: err.config.timeout
          }
        });
      } else {
        // Erro ao configurar a requisição
        setError(`Erro: ${err.message}`);
        setDetailedError({
          type: 'Erro de configuração',
          message: err.message
        });
      }
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Teste de Conexão</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Verificando a conexão com o backend</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="p-4 border border-gray-300 rounded-md">
              <p className="mb-2">
                <strong>Status:</strong> 
                <span className={
                  status === 'Conectado com sucesso!' ? 'text-green-600 ml-2 font-semibold' : 
                  status === 'Verificando conexão...' ? 'text-yellow-600 ml-2 font-semibold' : 
                  'text-red-600 ml-2 font-semibold'
                }>
                  {status}
                </span>
              </p>
              
              <p className="mb-2"><strong>URL da API:</strong> <span className="ml-2">{apiUrl}</span></p>
              
              {serverPort && (
                <p className="mb-2"><strong>Porta do Servidor:</strong> <span className="ml-2">{serverPort}</span></p>
              )}
              
              {serverEnvironment && (
                <p className="mb-2"><strong>Ambiente:</strong> <span className="ml-2">{serverEnvironment}</span></p>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 font-medium">Erro:</p>
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {serverInfo && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700 font-medium">Informações do Servidor:</p>
                  <p className="text-green-600"><strong>Mensagem:</strong> {serverInfo.message}</p>
                  <p className="text-green-600"><strong>Timestamp:</strong> {serverInfo.timestamp}</p>
                </div>
              )}
              
              {detailedError && (
                <div className="mt-4">
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 font-medium">Detalhes técnicos do erro</summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto">
                      {JSON.stringify(detailedError, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <button
              onClick={testConnection}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Testar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 