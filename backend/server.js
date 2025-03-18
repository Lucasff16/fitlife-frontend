const dotenv = require('dotenv');
const app = require('./app');

// Carregar variáveis de ambiente
dotenv.config();

// Tratamento de exceções não capturadas
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
  process.exit(1);
});

// Definir a porta
const PORT = process.env.PORT || 4000;

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`✅ Servidor rodando no modo ${process.env.NODE_ENV || 'development'} na porta ${PORT}`);
});

// Lidar com encerramento gracioso
process.on('SIGTERM', () => {
  console.log('🛑 Recebido sinal SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido sinal SIGINT, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

module.exports = { app, server };