/**
 * Script para iniciar o servidor no Render sem executar comandos git
 * Este script é usado como ponto de entrada no Render para evitar o erro "unknown switch 'u'"
 */

console.log('=== Iniciando servidor no Render ===');

// Verificar se estamos no ambiente do Render
const isRender = process.env.RENDER === 'true';
console.log(`Ambiente Render: ${isRender ? 'Sim' : 'Não'}`);

// Iniciar o servidor
console.log('Iniciando o servidor...');
require('./server.js'); 