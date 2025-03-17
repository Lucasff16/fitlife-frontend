# Script para iniciar os servidores do Projeto Fitness
Write-Host "Iniciando servidores do Projeto Fitness..." -ForegroundColor Green

# Iniciar o servidor backend
Write-Host "Iniciando o servidor backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Aguardar 3 segundos para o backend iniciar
Write-Host "Aguardando o backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Iniciar o servidor frontend
Write-Host "Iniciando o servidor frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Servidores iniciados com sucesso!" -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:5174" -ForegroundColor Magenta
Write-Host "Pressione qualquer tecla para abrir o frontend no navegador..." -ForegroundColor Yellow

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:5174" 