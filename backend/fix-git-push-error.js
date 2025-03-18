/**
 * Script para verificar e corrigir o problema do "unknown switch 'u'" no Render
 * 
 * Este script verifica se há algum comando git push sendo executado
 * durante o processo de build ou start no Render e o remove.
 */

console.log('=== Correção do Erro "unknown switch \'u\'" ===');

// Função para verificar e corrigir o problema
async function fixGitPushError() {
  console.log('Verificando possíveis causas do erro...');
  
  // Verificar se estamos no ambiente do Render
  const isRender = process.env.RENDER === 'true';
  console.log(`Ambiente Render: ${isRender ? 'Sim' : 'Não'}`);
  
  // Verificar se há algum arquivo .npmrc que possa estar causando o problema
  const fs = require('fs');
  const path = require('path');
  
  try {
    const npmrcPath = path.join(process.cwd(), '.npmrc');
    if (fs.existsSync(npmrcPath)) {
      console.log('Arquivo .npmrc encontrado. Verificando conteúdo...');
      const npmrc = fs.readFileSync(npmrcPath, 'utf8');
      
      if (npmrc.includes('git-push') || npmrc.includes('git push')) {
        console.log('ALERTA: O arquivo .npmrc contém configurações relacionadas ao git push!');
        console.log('Conteúdo atual:');
        console.log(npmrc);
        
        // Criar backup do arquivo
        fs.writeFileSync(`${npmrcPath}.bak`, npmrc);
        console.log('Backup do arquivo .npmrc criado.');
        
        // Remover linhas relacionadas ao git push
        const newNpmrc = npmrc
          .split('\n')
          .filter(line => !line.includes('git-push') && !line.includes('git push'))
          .join('\n');
        
        fs.writeFileSync(npmrcPath, newNpmrc);
        console.log('Arquivo .npmrc atualizado. Linhas relacionadas ao git push removidas.');
      } else {
        console.log('Nenhuma configuração relacionada ao git push encontrada no arquivo .npmrc.');
      }
    } else {
      console.log('Arquivo .npmrc não encontrado.');
    }
  } catch (error) {
    console.error(`Erro ao verificar/corrigir .npmrc: ${error.message}`);
  }
  
  // Verificar se há algum hook do Git que possa estar causando o problema
  try {
    const gitHooksPath = path.join(process.cwd(), '.git', 'hooks');
    if (fs.existsSync(gitHooksPath)) {
      console.log('Diretório .git/hooks encontrado. Verificando hooks...');
      
      const hooks = fs.readdirSync(gitHooksPath);
      let foundGitPushInHooks = false;
      
      hooks.forEach(hook => {
        const hookPath = path.join(gitHooksPath, hook);
        if (fs.statSync(hookPath).isFile() && !hook.endsWith('.sample')) {
          const content = fs.readFileSync(hookPath, 'utf8');
          if (content.includes('git push -u') || content.includes('git push --set-upstream')) {
            foundGitPushInHooks = true;
            console.log(`ALERTA: O hook "${hook}" contém um comando "git push -u"!`);
            
            // Criar backup do hook
            fs.writeFileSync(`${hookPath}.bak`, content);
            console.log(`Backup do hook ${hook} criado.`);
            
            // Remover ou comentar linhas relacionadas ao git push -u
            const newContent = content
              .split('\n')
              .map(line => {
                if (line.includes('git push -u') || line.includes('git push --set-upstream')) {
                  return `# ${line} # Comentado pelo script fix-git-push-error.js`;
                }
                return line;
              })
              .join('\n');
            
            fs.writeFileSync(hookPath, newContent);
            console.log(`Hook ${hook} atualizado. Comandos git push -u comentados.`);
          }
        }
      });
      
      if (!foundGitPushInHooks) {
        console.log('Nenhum hook contendo comandos git push -u encontrado.');
      }
    } else {
      console.log('Diretório .git/hooks não encontrado.');
    }
  } catch (error) {
    console.error(`Erro ao verificar/corrigir hooks do Git: ${error.message}`);
  }
  
  console.log('\nVerificação e correção concluídas!');
  console.log('Se o erro "unknown switch \'u\'" persistir, verifique os logs para mais informações.');
}

// Executar a função de correção
fixGitPushError().catch(error => {
  console.error('Erro durante a execução do script:', error);
}); 