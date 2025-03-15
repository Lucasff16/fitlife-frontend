/**
 * Middleware para registrar tentativas de violação de segurança
 */
const fs = require('fs');
const path = require('path');

// Função para registrar eventos de segurança
const logSecurityEvent = (req, event, details) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const method = req.method;
  const url = req.originalUrl;
  
  const logEntry = {
    timestamp,
    ip,
    userAgent,
    method,
    url,
    event,
    details
  };
  
  // Criar diretório de logs se não existir
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Registrar em arquivo
  const logFile = path.join(logDir, 'security.log');
  fs.appendFileSync(
    logFile, 
    JSON.stringify(logEntry) + '\n',
    { encoding: 'utf8' }
  );
  
  // Registrar no console em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Evento de segurança: ${event} - IP: ${ip} - URL: ${url}`);
  }
};

// Middleware para registrar tentativas de rate limit
const rateLimitLogger = (req, res, next) => {
  const oldSend = res.send;
  
  res.send = function(data) {
    // Verificar se é uma resposta de rate limit
    if (res.statusCode === 429) {
      logSecurityEvent(req, 'RATE_LIMIT_EXCEEDED', {
        headers: req.headers,
        body: req.body
      });
    }
    
    return oldSend.apply(res, arguments);
  };
  
  next();
};

// Middleware para registrar erros CSRF
const csrfErrorLogger = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    logSecurityEvent(req, 'CSRF_ATTACK_ATTEMPT', {
      headers: req.headers,
      body: req.body
    });
    
    return res.status(403).json({
      success: false,
      message: 'Falha na validação do token CSRF'
    });
  }
  
  next(err);
};

module.exports = {
  logSecurityEvent,
  rateLimitLogger,
  csrfErrorLogger
}; 