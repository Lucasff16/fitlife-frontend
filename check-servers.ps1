# Script para verificar o status dos servidores do Projeto Fitness
Write-Host "Verificando status dos servidores do Projeto Fitness..." -ForegroundColor Cyan

# Verificar processos Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Encontrados $($nodeProcesses.Count) processos Node.js em execução:" -ForegroundColor Green
    
    # Mostrar detalhes de cada processo
    foreach ($process in $nodeProcesses) {
        Write-Host "  - PID: $($process.Id), CPU: $($process.CPU), Memória: $([math]::Round($process.WorkingSet / 1MB, 2)) MB" -ForegroundColor Yellow
    }
} else {
    Write-Host "Nenhum processo Node.js encontrado em execução." -ForegroundColor Red
    Write-Host "Os servidores não estão rodando!" -ForegroundColor Red
    exit
}

# Verificar se as portas estão em uso
$backendPort = 4000
$frontendPort = 5174

$backendPortInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
$frontendPortInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue

Write-Host "`nStatus das portas:" -ForegroundColor Cyan
if ($backendPortInUse) {
    Write-Host "  - Backend (porta $backendPort): ONLINE" -ForegroundColor Green
} else {
    Write-Host "  - Backend (porta $backendPort): OFFLINE" -ForegroundColor Red
}

if ($frontendPortInUse) {
    Write-Host "  - Frontend (porta $frontendPort): ONLINE" -ForegroundColor Green
} else {
    Write-Host "  - Frontend (porta $frontendPort): OFFLINE" -ForegroundColor Red
}

Write-Host "`nURLs dos servidores:" -ForegroundColor Cyan
Write-Host "  - Backend API: http://localhost:$backendPort/api" -ForegroundColor Magenta
Write-Host "  - Frontend: http://localhost:$frontendPort" -ForegroundColor Magenta

Write-Host "`nPressione 'O' para abrir o frontend no navegador ou qualquer outra tecla para sair..." -ForegroundColor Yellow
$key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

if ($key.Character -eq 'O' -or $key.Character -eq 'o') {
    Start-Process "http://localhost:$frontendPort"
} 