const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');

// Tratamento de exceções não capturadas
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
  process.exit(1);
});

// Carregar variáveis de ambiente
dotenv.config();

// Importar configurações
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');
const { protect } = require('./middleware/auth');
const { startTokenCleanup } = require('./utils/tokenCleaner');
const { rateLimitLogger, csrfErrorLogger } = require('./middleware/securityLogger');

// Importar modelos
const User = require('./models/User');

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const progressRoutes = require('./routes/progress');
const testRoutes = require('./routes/test');

const app = express();

// Configuração do rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela
  standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente mais tarde.'
  },
  skipSuccessfulRequests: false, // Não pular requisições bem-sucedidas
});

// Configuração do rate limiting mais restritivo para tentativas de login
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // limite de 10 tentativas de login por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente mais tarde.'
  },
  skipSuccessfulRequests: false,
});

// Configuração do rate limiting para registro de usuários
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // limite de 5 registros por hora por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitos registros deste IP. Tente novamente mais tarde.'
  },
  skipSuccessfulRequests: false,
});

// Configuração do rate limiting para redefinição de senha
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // limite de 3 solicitações de redefinição de senha por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas solicitações de redefinição de senha. Tente novamente mais tarde.'
  },
  skipSuccessfulRequests: false,
});

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cloudinary.com", 
        "http://localhost:4000", "http://localhost:4001", 
        "http://localhost:4002", "http://localhost:4003", 
        "http://localhost:4004", "http://localhost:4005"]
    }
  },
  crossOriginEmbedderPolicy: false,
  xssFilter: true, // Habilitar proteção XSS
  noSniff: true, // Evitar MIME type sniffing
  referrerPolicy: { policy: 'same-origin' }, // Controlar informações de referência
  hsts: { // HTTP Strict Transport Security
    maxAge: 15552000, // 180 dias em segundos
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' } // Evitar clickjacking
}));

// Adicionar logger de segurança para rate limiting
app.use(rateLimitLogger);

// Configuração do CORS
app.use(cors({
  origin: function(origin, callback) {
    // Permitir qualquer origem localhost com portas variáveis (desenvolvimento)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180'
    ];
    
    // Em produção, usar a URL do frontend definida no .env
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Permitir requisições sem origem (como de Postman ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.match(/^http:\/\/localhost:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'CSRF-Token']
}));

// Logging em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parser para JSON e cookies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Configuração de proteção CSRF
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Rota para obter token CSRF
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API do FitLife está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    dbConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Habilitar rotas de autenticação com rate limiting
app.use('/api/auth/register', registerLimiter, csrfProtection); // Adicionar proteção CSRF
app.use('/api/auth/login', loginLimiter); // Sem CSRF para login
app.use('/api/auth/forgotpassword', passwordResetLimiter); // Sem CSRF para recuperação de senha
app.use('/api/auth', authLimiter); // Rate limit geral para rotas de autenticação
app.use('/api/auth', authRoutes);

// Outras rotas da API com proteção CSRF para métodos que modificam dados
app.use('/api/users', protect, userRoutes);
app.use('/api/exercises', protect, exerciseRoutes);
app.use('/api/workouts', protect, workoutRoutes);
app.use('/api/progress', protect, progressRoutes);
app.use('/api', csrfProtection, require('./routes/fitnessIdeas.routes'));

// Rotas da API
app.use('/api/test', testRoutes);

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint não encontrado' 
  });
});

// Middleware para erros CSRF
app.use(csrfErrorLogger);

// Middleware de tratamento de erros
app.use(errorHandler);

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();
    
    // Se chegou aqui, a conexão foi bem-sucedida
    console.log('✅ MongoDB conectado com sucesso!');
    
    // Iniciar limpeza de tokens
    startTokenCleanup(12);
    
    // Usar porta fixa para estabilidade
    const PORT = parseInt(process.env.PORT || '4000', 10);
    
    // Armazenar a porta como propriedade do app para acesso nas rotas
    app.set('port', PORT);
    
    const server = require('http').createServer(app);
    
    server.listen(PORT, () => {
      const NODE_ENV = process.env.NODE_ENV || 'development';
      console.log(`✅ Servidor rodando no modo ${NODE_ENV} na porta ${PORT}`);
    });
    
    // Tratamento de erros não capturados
    process.on('unhandledRejection', (err) => {
      console.log(`❌ Erro: ${err.message}`);
      console.log('❌ Desligando servidor devido a erro não tratado');
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();

module.exports = app;