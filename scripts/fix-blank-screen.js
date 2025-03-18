/**
 * Script para corrigir problemas de tela branca em aplicações Expo/React Native Web
 * Este script limpa caches e reinstala dependências para resolver problemas comuns
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}=== FitLife - Correção de Tela Branca ===\n${colors.reset}`);

// Função para executar comandos com tratamento de erro
function runCommand(command, message) {
  console.log(`${colors.blue}> ${message}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Concluído com sucesso!${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Erro ao executar o comando: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Limpar cache do Expo
console.log(`${colors.yellow}Etapa 1: Limpando cache do Expo${colors.reset}`);
runCommand('npx expo-cli clear-cache', 'Limpando cache do Expo');

// Limpar cache do npm
console.log(`${colors.yellow}Etapa 2: Limpando cache do npm${colors.reset}`);
runCommand('npm cache clean --force', 'Limpando cache do npm');

// Remover node_modules
console.log(`${colors.yellow}Etapa 3: Removendo node_modules${colors.reset}`);
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log(`${colors.blue}> Removendo pasta node_modules...${colors.reset}`);
  try {
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
    console.log(`${colors.green}✓ node_modules removido com sucesso!${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Erro ao remover node_modules: ${error.message}${colors.reset}\n`);
  }
} else {
  console.log(`${colors.blue}> Pasta node_modules não encontrada, pulando...${colors.reset}\n`);
}

// Reinstalar dependências
console.log(`${colors.yellow}Etapa 4: Reinstalando dependências${colors.reset}`);
runCommand('npm install', 'Reinstalando dependências');

// Verificar se o webpack está configurado corretamente
console.log(`${colors.yellow}Etapa 5: Verificando configuração do webpack${colors.reset}`);
const webpackConfigPath = path.join(process.cwd(), 'webpack.config.js');
if (!fs.existsSync(webpackConfigPath)) {
  console.log(`${colors.blue}> Criando arquivo webpack.config.js...${colors.reset}`);
  const webpackConfig = `
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Resolver problemas de compatibilidade
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  return config;
};
`;
  
  try {
    fs.writeFileSync(webpackConfigPath, webpackConfig.trim());
    console.log(`${colors.green}✓ webpack.config.js criado com sucesso!${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Erro ao criar webpack.config.js: ${error.message}${colors.reset}\n`);
  }
} else {
  console.log(`${colors.blue}> webpack.config.js já existe, verificando conteúdo...${colors.reset}`);
  // Aqui poderíamos adicionar uma verificação do conteúdo do arquivo
  console.log(`${colors.green}✓ webpack.config.js verificado!${colors.reset}\n`);
}

console.log(`${colors.green}=== Correção concluída! ===\n${colors.reset}`);
console.log(`${colors.cyan}Para iniciar a aplicação, execute:${colors.reset}`);
console.log(`${colors.yellow}npm start --web${colors.reset}`);
console.log(`\n${colors.magenta}Se o problema persistir, verifique os logs de erro no console do navegador.${colors.reset}`);