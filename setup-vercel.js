/**
 * Script para configurar o deploy no Vercel
 * 
 * Este script verifica se o projeto está configurado corretamente para o deploy no Vercel
 * e faz as alterações necessárias.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Configurando deploy no Vercel ===');

// Verificar se estamos no diretório raiz do projeto
const isRootDir = fs.existsSync('frontend') && fs.existsSync('backend');
if (!isRootDir) {
  console.error('Este script deve ser executado no diretório raiz do projeto!');
  process.exit(1);
}

// Verificar se o package.json do frontend existe
const frontendPackageJsonPath = path.join('frontend', 'package.json');
if (!fs.existsSync(frontendPackageJsonPath)) {
  console.error(`Arquivo ${frontendPackageJsonPath} não encontrado!`);
  process.exit(1);
}

// Ler o package.json do frontend
let frontendPackageJson;
try {
  frontendPackageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));
} catch (error) {
  console.error(`Erro ao ler ${frontendPackageJsonPath}:`, error.message);
  process.exit(1);
}

// Verificar se o script de build existe
if (!frontendPackageJson.scripts || !frontendPackageJson.scripts.build) {
  console.log('Adicionando script de build ao package.json do frontend...');
  
  if (!frontendPackageJson.scripts) {
    frontendPackageJson.scripts = {};
  }
  
  frontendPackageJson.scripts.build = 'vite build';
  
  // Salvar o package.json atualizado
  fs.writeFileSync(frontendPackageJsonPath, JSON.stringify(frontendPackageJson, null, 2));
  console.log('Script de build adicionado com sucesso!');
} else {
  console.log('Script de build já existe no package.json do frontend.');
}

// Verificar se o vercel.json do frontend existe
const frontendVercelJsonPath = path.join('frontend', 'vercel.json');
if (!fs.existsSync(frontendVercelJsonPath)) {
  console.log('Criando arquivo vercel.json no diretório frontend...');
  
  const vercelJson = {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "Content-Security-Policy",
            "value": "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self'"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ],
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite"
  };
  
  // Salvar o vercel.json
  fs.writeFileSync(frontendVercelJsonPath, JSON.stringify(vercelJson, null, 2));
  console.log('Arquivo vercel.json criado com sucesso!');
} else {
  console.log('Arquivo vercel.json já existe no diretório frontend.');
}

// Verificar se o vercel.json na raiz existe
const rootVercelJsonPath = 'vercel.json';
if (!fs.existsSync(rootVercelJsonPath)) {
  console.log('Criando arquivo vercel.json na raiz do projeto...');
  
  const rootVercelJson = {
    "version": 2,
    "builds": [
      {
        "src": "frontend/package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "frontend/dist"
        }
      }
    ],
    "routes": [
      { "src": "/(.*)", "dest": "frontend/dist/$1" }
    ],
    "github": {
      "silent": true
    }
  };
  
  // Salvar o vercel.json na raiz
  fs.writeFileSync(rootVercelJsonPath, JSON.stringify(rootVercelJson, null, 2));
  console.log('Arquivo vercel.json criado na raiz do projeto com sucesso!');
} else {
  console.log('Arquivo vercel.json já existe na raiz do projeto.');
}

// Verificar se o package.json na raiz existe
const rootPackageJsonPath = 'package.json';
if (fs.existsSync(rootPackageJsonPath)) {
  console.log('Atualizando package.json na raiz do projeto...');
  
  let rootPackageJson;
  try {
    rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
  } catch (error) {
    console.error(`Erro ao ler ${rootPackageJsonPath}:`, error.message);
    process.exit(1);
  }
  
  // Adicionar scripts para o frontend
  if (!rootPackageJson.scripts) {
    rootPackageJson.scripts = {};
  }
  
  rootPackageJson.scripts['dev-frontend'] = 'cd frontend && npm run dev';
  rootPackageJson.scripts['build-frontend'] = 'cd frontend && npm run build';
  rootPackageJson.scripts['start-frontend'] = 'cd frontend && npm run preview';
  rootPackageJson.scripts['lint-frontend'] = 'cd frontend && npm run lint';
  rootPackageJson.scripts['test-frontend'] = 'cd frontend && npm run test';
  
  // Adicionar engines
  if (!rootPackageJson.engines) {
    rootPackageJson.engines = {};
  }
  
  rootPackageJson.engines.node = '>=18.20.7';
  
  // Salvar o package.json atualizado
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
  console.log('Package.json na raiz do projeto atualizado com sucesso!');
} else {
  console.log('Criando package.json na raiz do projeto...');
  
  const rootPackageJson = {
    "name": "fitlife-frontend",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "cd frontend && npm run dev",
      "build": "cd frontend && npm run build",
      "start": "cd frontend && npm run preview",
      "lint": "cd frontend && npm run lint",
      "test": "cd frontend && npm run test"
    },
    "engines": {
      "node": ">=18.20.7"
    }
  };
  
  // Salvar o package.json na raiz
  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
  console.log('Package.json criado na raiz do projeto com sucesso!');
}

console.log('\n=== Configuração concluída com sucesso! ===');
console.log('\nAgora você pode fazer o deploy no Vercel:');
console.log('1. Faça commit e push das alterações:');
console.log('   git add .');
console.log('   git commit -m "Configura deploy no Vercel"');
console.log('   git push');
console.log('2. Acesse o dashboard do Vercel e importe o repositório');
console.log('3. Selecione o framework "Vite" e clique em "Deploy"');
console.log('\nO Vercel encontrará o script de build e fará o deploy do frontend com sucesso!'); 