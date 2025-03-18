/**
 * Script para verificar a versão do React e suas dependências
 */

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

console.log(`${colors.cyan}=== FitLife - Verificação de Versões do React ===\n${colors.reset}`);

// Função para ler o package.json
function readPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.error(`${colors.red}Erro ao ler package.json: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Verificar versões
function checkVersions() {
  const packageJson = readPackageJson();
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Versões recomendadas
  const recommendedVersions = {
    'react': '18.2.0',
    'react-dom': '18.2.0',
    'react-native': '0.72.6',
    'react-native-web': '~0.19.6',
    '@react-navigation/native': '^6.1.9',
    'expo': '~49.0.15',
  };
  
  console.log(`${colors.yellow}Verificando versões das dependências principais:${colors.reset}\n`);
  
  // Verificar cada dependência
  for (const [dep, recommendedVersion] of Object.entries(recommendedVersions)) {
    if (dependencies[dep]) {
      const currentVersion = dependencies[dep].replace(/[\^~]/g, '');
      const recVersion = recommendedVersion.replace(/[\^~]/g, '');
      
      console.log(`${colors.blue}${dep}:${colors.reset}`);
      console.log(`  Versão atual: ${colors.green}${dependencies[dep]}${colors.reset}`);
      console.log(`  Versão recomendada: ${colors.yellow}${recommendedVersion}${colors.reset}`);
      
      // Verificar compatibilidade
      if (currentVersion === recVersion) {
        console.log(`  ${colors.green}✓ Versão compatível!${colors.reset}\n`);
      } else {
        console.log(`  ${colors.yellow}⚠️ Versão diferente da recomendada.${colors.reset}\n`);
      }
    } else {
      console.log(`${colors.blue}${dep}:${colors.reset}`);
      console.log(`  ${colors.red}✗ Não instalado!${colors.reset}`);
      console.log(`  Versão recomendada: ${colors.yellow}${recommendedVersion}${colors.reset}\n`);
    }
  }
  
  // Verificar compatibilidade entre React e React Native
  if (dependencies['react'] && dependencies['react-native']) {
    console.log(`${colors.magenta}Verificando compatibilidade entre React e React Native:${colors.reset}`);
    
    const reactVersion = dependencies['react'].replace(/[\^~]/g, '');
    const reactNativeVersion = dependencies['react-native'].replace(/[\^~]/g, '');
    
    if (reactVersion === '18.2.0' && reactNativeVersion.startsWith('0.72')) {
      console.log(`  ${colors.green}✓ React ${reactVersion} é compatível com React Native ${reactNativeVersion}${colors.reset}\n`);
    } else {
      console.log(`  ${colors.yellow}⚠️ Possível incompatibilidade entre React ${reactVersion} e React Native ${reactNativeVersion}${colors.reset}`);
      console.log(`  Recomendação: React 18.2.0 com React Native 0.72.x\n`);
    }
  }
}

// Executar verificação
checkVersions();

console.log(`${colors.green}=== Verificação concluída! ===\n${colors.reset}`);
console.log(`${colors.cyan}Se encontrou incompatibilidades, considere atualizar as dependências para as versões recomendadas.${colors.reset}`);
console.log(`${colors.yellow}Para atualizar uma dependência específica: npm install [pacote]@[versão]${colors.reset}`);