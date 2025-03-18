# Script para abrir o aplicativo no navegador
Write-Host "Abrindo o Projeto Fitness no navegador..." -ForegroundColor Cyan

# Verificar se o frontend está rodando
$frontendPort = 5174
$frontendPortInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

if ($frontendPortInUse) {
    Write-Host "Frontend detectado na porta $frontendPort. Abrindo no navegador..." -ForegroundColor Green
    Start-Process "http://localhost:$frontendPort"
} else {
    Write-Host "AVISO: Frontend não detectado na porta $frontendPort!" -ForegroundColor Yellow
    
    # Perguntar se deseja iniciar os servidores
    Write-Host "O frontend não parece estar rodando. Deseja iniciar os servidores? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "S" -or $response -eq "s") {
        # Executar o script de inicialização
        Write-Host "Iniciando os servidores..." -ForegroundColor Cyan
        & "$PSScriptRoot\start-servers.ps1"
    } else {
        Write-Host "Tentando abrir o frontend mesmo assim..." -ForegroundColor Yellow
        Start-Process "http://localhost:$frontendPort"
    }
} 