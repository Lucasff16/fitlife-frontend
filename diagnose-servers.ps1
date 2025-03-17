# Script para diagnosticar problemas nos servidores do Projeto Fitness
Write-Host "Diagnosticando servidores do Projeto Fitness..." -ForegroundColor Cyan

# Verificar versão do Node.js
try {
    $nodeVersion = node -v
    Write-Host "Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Node.js não encontrado! Por favor, instale o Node.js v18.20.7 ou superior." -ForegroundColor Red
    exit
}

# Verificar se as portas estão disponíveis
$backendPort = 4000
$frontendPort = 5174

$backendPortInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
$frontendPortInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

Write-Host "`nVerificando portas:" -ForegroundColor Cyan
if ($backendPortInUse) {
    Write-Host "AVISO: Porta $backendPort (backend) já está em uso pelo processo com PID $($backendPortInUse[0].OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "Porta $backendPort (backend) está disponível" -ForegroundColor Green
}

if ($frontendPortInUse) {
    Write-Host "AVISO: Porta $frontendPort (frontend) já está em uso pelo processo com PID $($frontendPortInUse[0].OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "Porta $frontendPort (frontend) está disponível" -ForegroundColor Green
}

# Verificar arquivos de configuração
Write-Host "`nVerificando arquivos de configuração:" -ForegroundColor Cyan

$backendEnv = Test-Path -Path "$PSScriptRoot\backend\.env"
if ($backendEnv) {
    Write-Host "Arquivo .env do backend encontrado" -ForegroundColor Green
} else {
    Write-Host "ERRO: Arquivo .env do backend não encontrado!" -ForegroundColor Red
    Write-Host "  Crie o arquivo .env no diretório backend com base no .env.example" -ForegroundColor Yellow
}

$frontendEnv = Test-Path -Path "$PSScriptRoot\frontend\.env"
if ($frontendEnv) {
    Write-Host "Arquivo .env do frontend encontrado" -ForegroundColor Green
} else {
    Write-Host "ERRO: Arquivo .env do frontend não encontrado!" -ForegroundColor Red
    Write-Host "  Crie o arquivo .env no diretório frontend com base no .env.example" -ForegroundColor Yellow
}

# Verificar dependências
Write-Host "`nVerificando dependências:" -ForegroundColor Cyan

$backendNodeModules = Test-Path -Path "$PSScriptRoot\backend\node_modules"
if ($backendNodeModules) {
    Write-Host "Dependências do backend instaladas" -ForegroundColor Green
} else {
    Write-Host "AVISO: Dependências do backend não encontradas!" -ForegroundColor Yellow
    Write-Host "  Execute 'npm install' no diretório backend" -ForegroundColor Yellow
}

$frontendNodeModules = Test-Path -Path "$PSScriptRoot\frontend\node_modules"
if ($frontendNodeModules) {
    Write-Host "Dependências do frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "AVISO: Dependências do frontend não encontradas!" -ForegroundColor Yellow
    Write-Host "  Execute 'npm install' no diretório frontend" -ForegroundColor Yellow
}

Write-Host "`nDiagnóstico concluído!" -ForegroundColor Green
Write-Host "Pressione 'F' para corrigir problemas automaticamente ou qualquer outra tecla para sair..." -ForegroundColor Yellow
$key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

if ($key.Character -eq 'F' -or $key.Character -eq 'f') {
    Write-Host "`nIniciando correção automática..." -ForegroundColor Cyan
    
    # Liberar portas se necessário
    if ($backendPortInUse) {
        Write-Host "Liberando porta $backendPort..." -ForegroundColor Yellow
        Stop-Process -Id $backendPortInUse[0].OwningProcess -Force -ErrorAction SilentlyContinue
    }
    
    if ($frontendPortInUse) {
        Write-Host "Liberando porta $frontendPort..." -ForegroundColor Yellow
        Stop-Process -Id $frontendPortInUse[0].OwningProcess -Force -ErrorAction SilentlyContinue
    }
    
    # Instalar dependências se necessário
    if (-not $backendNodeModules) {
        Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
        Set-Location "$PSScriptRoot\backend"
        npm install
    }
    
    if (-not $frontendNodeModules) {
        Write-Host "Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location "$PSScriptRoot\frontend"
        npm install
    }
    
    Write-Host "`nCorreção automática concluída!" -ForegroundColor Green
    Write-Host "Agora você pode iniciar os servidores com o script start-servers.ps1" -ForegroundColor Cyan
} 