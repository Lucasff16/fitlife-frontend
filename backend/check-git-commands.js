/**
 * Script para verificar se há algum comando git sendo executado
 * durante o processo de build ou start no Render
 */

console.log('=== Verificação de Comandos Git ===');

// Verificar variáveis de ambiente
console.log('\nVariáveis de ambiente relacionadas ao Git:');
Object.keys(process.env)
  .filter(key => key.toLowerCase().includes('git') || 
                 process.env[key].toLowerCase().includes('git'))
  .forEach(key => {
    console.log(`- ${key}: ${process.env[key]}`);
  });

// Verificar scripts no package.json
console.log('\nVerificando scripts no package.json:');
try {
  const packageJson = require('./package.json');
  const scripts = packageJson.scripts || {};
  
  Object.keys(scripts).forEach(scriptName => {
    const scriptContent = scripts[scriptName];
    if (scriptContent.includes('git')) {
      console.log(`- Script "${scriptName}": ${scriptContent}`);
    }
  });
  
  if (!Object.keys(scripts).some(scriptName => scripts[scriptName].includes('git'))) {
    console.log('Nenhum script contendo comandos git encontrado no package.json');
  }
} catch (error) {
  console.error(`Erro ao verificar package.json: ${error.message}`);
}

// Verificar se há algum hook do Git
console.log('\nVerificando hooks do Git:');
const fs = require('fs');
const path = require('path');

try {
  const gitHooksPath = path.join(process.cwd(), '.git', 'hooks');
  if (fs.existsSync(gitHooksPath)) {
    const hooks = fs.readdirSync(gitHooksPath);
    hooks.forEach(hook => {
      const hookPath = path.join(gitHooksPath, hook);
      if (fs.statSync(hookPath).isFile() && !hook.endsWith('.sample')) {
        console.log(`- Hook encontrado: ${hook}`);
        const content = fs.readFileSync(hookPath, 'utf8');
        if (content.includes('git push')) {
          console.log(`  ALERTA: O hook "${hook}" contém um comando "git push"!`);
          console.log(`  Conteúdo: ${content.substring(0, 100)}...`);
        }
      }
    });
    
    if (hooks.every(hook => hook.endsWith('.sample'))) {
      console.log('Apenas hooks de exemplo encontrados, nenhum hook ativo');
    }
  } else {
    console.log('Diretório .git/hooks não encontrado');
  }
} catch (error) {
  console.error(`Erro ao verificar hooks do Git: ${error.message}`);
}

// Verificar se há algum arquivo de configuração do Git
console.log('\nVerificando arquivos de configuração do Git:');
try {
  const gitConfigPath = path.join(process.cwd(), '.git', 'config');
  if (fs.existsSync(gitConfigPath)) {
    const config = fs.readFileSync(gitConfigPath, 'utf8');
    console.log('Arquivo .git/config encontrado');
    
    if (config.includes('push')) {
      console.log('ALERTA: O arquivo .git/config contém configurações de push!');
      const pushLines = config.split('\n').filter(line => line.includes('push'));
      pushLines.forEach(line => console.log(`- ${line.trim()}`));
    }
  } else {
    console.log('Arquivo .git/config não encontrado');
  }
} catch (error) {
  console.error(`Erro ao verificar configuração do Git: ${error.message}`);
}

console.log('\n=== Fim da Verificação ===');
console.log('Se você está vendo este log no Render, significa que o script foi executado com sucesso.');
console.log('Verifique se há algum ALERTA acima que possa indicar a origem do erro "unknown switch \'u\'".'); 