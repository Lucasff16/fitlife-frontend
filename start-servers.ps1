# Script para iniciar os servidores do Projeto Fitness
Write-Host "Iniciando servidores do Projeto Fitness..." -ForegroundColor Green

# Verificar se os servidores já estão rodando
$backendPort = 4000
$frontendPort = 5174

$backendPortInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
$frontendPortInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

if ($backendPortInUse) {
    Write-Host "Backend já está rodando na porta $backendPort" -ForegroundColor Yellow
} else {
    # Iniciar o servidor backend
    Write-Host "Iniciando o servidor backend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm run dev"
    
    # Aguardar 3 segundos para o backend iniciar
    Write-Host "Aguardando o backend iniciar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

if ($frontendPortInUse) {
    Write-Host "Frontend já está rodando na porta $frontendPort" -ForegroundColor Yellow
} else {
    # Iniciar o servidor frontend
    Write-Host "Iniciando o servidor frontend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"
}

Write-Host "Servidores iniciados com sucesso!" -ForegroundColor Green
Write-Host "Backend: http://localhost:$backendPort" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:$frontendPort" -ForegroundColor Magenta
Write-Host "Pressione qualquer tecla para abrir o frontend no navegador..." -ForegroundColor Yellow

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:$frontendPort" 