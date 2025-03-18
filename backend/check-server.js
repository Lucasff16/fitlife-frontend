// Script para verificar se o server.js está sendo encontrado corretamente
const fs = require('fs');
const path = require('path');

console.log('=== Verificação do server.js ===');
console.log('Diretório atual:', process.cwd());

// Verificar se o server.js existe no diretório atual
const serverPath = path.join(process.cwd(), 'server.js');
console.log('Caminho completo do server.js:', serverPath);

try {
  const stats = fs.statSync(serverPath);
  console.log('server.js encontrado!');
  console.log('Tamanho do arquivo:', stats.size, 'bytes');
  console.log('Última modificação:', stats.mtime);
  
  // Ler as primeiras linhas do arquivo para confirmar que é o arquivo correto
  const content = fs.readFileSync(serverPath, 'utf8').split('\n').slice(0, 5).join('\n');
  console.log('\nPrimeiras 5 linhas do server.js:');
  console.log(content);
} catch (error) {
  console.error('Erro ao verificar server.js:', error.message);
  
  // Listar todos os arquivos no diretório atual
  console.log('\nArquivos no diretório atual:');
  try {
    const files = fs.readdirSync('.');
    files.forEach(file => console.log(`- ${file}`));
  } catch (err) {
    console.error('Erro ao listar arquivos:', err.message);
  }
}

console.log('\n=== Fim da Verificação ==='); 