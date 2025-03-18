# Medidas de Segurança - FitLife API

Este documento descreve as medidas de segurança implementadas na API do FitLife para proteger contra ameaças comuns.

## Proteções Implementadas

### 1. Helmet

O Helmet é utilizado para configurar cabeçalhos HTTP relacionados à segurança:

- **Content Security Policy (CSP)**: Controla quais recursos podem ser carregados
- **XSS Protection**: Proteção contra ataques de Cross-Site Scripting
- **MIME Sniffing Prevention**: Evita que o navegador interprete arquivos de forma incorreta
- **HTTP Strict Transport Security (HSTS)**: Força conexões HTTPS
- **Clickjacking Protection**: Evita que a aplicação seja carregada em iframes
- **Referrer Policy**: Controla as informações de referência enviadas em requisições

### 2. Rate Limiting

Limitação de taxa para prevenir ataques de força bruta e DoS:

- **Geral para rotas de autenticação**: 100 requisições por 15 minutos
- **Login**: 10 tentativas por hora
- **Registro**: 5 registros por hora
- **Redefinição de senha**: 3 solicitações por hora

### 3. CSRF Protection

Proteção contra ataques Cross-Site Request Forgery:

- Tokens CSRF são gerados e validados para todas as requisições que modificam dados
- Rota `/api/csrf-token` para obter um token CSRF válido
- Cookies seguros e HttpOnly para armazenar tokens

### 4. Limitação de Tamanho de Requisições

- Limite de 1MB para requisições JSON e formulários para prevenir ataques DoS

### 5. Logging de Segurança

- Registro de tentativas de violação de segurança
- Logs de tentativas de exceder rate limits
- Logs de tentativas de ataques CSRF

## Boas Práticas Adicionais

1. **Autenticação**:
   - Tokens JWT com expiração curta
   - Refresh tokens com rotação
   - Senhas armazenadas com hash usando bcrypt

2. **Autorização**:
   - Verificação de permissões baseada em roles
   - Verificação de propriedade de recursos

3. **Validação de Dados**:
   - Validação de entrada em todas as rotas
   - Sanitização de dados para prevenir injeções

## Configuração no Frontend

Para trabalhar com a proteção CSRF no frontend:

1. Obter o token CSRF:
```javascript
const getCsrfToken = async () => {
  const response = await axios.get('/api/csrf-token');
  return response.data.csrfToken;
};
```

2. Incluir o token em todas as requisições que modificam dados:
```javascript
axios.post('/api/resource', data, {
  headers: {
    'CSRF-Token': csrfToken
  }
});
```

## Monitoramento e Resposta a Incidentes

Os logs de segurança são armazenados em `backend/logs/security.log` e devem ser monitorados regularmente para identificar tentativas de ataque. 