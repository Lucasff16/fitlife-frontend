const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rota de teste para verificar a conexão
router.get('/', (req, res) => {
  // Obter a porta do servidor
  const port = req.app.get('port') || process.env.PORT || '4000';
  
  res.status(200).json({
    success: true,
    message: 'Conexão com o backend estabelecida com sucesso!',
    timestamp: new Date().toISOString(),
    serverInfo: {
      port: port,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// @route   GET /api/protected
// @desc    Rota protegida para testes
// @access  Private
router.get('/protected', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Você acessou uma rota protegida!',
    user: req.user
  });
});

module.exports = router; 