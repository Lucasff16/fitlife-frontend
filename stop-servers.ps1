# Script para parar os servidores do Projeto Fitness
Write-Host "Parando servidores do Projeto Fitness..." -ForegroundColor Red

# Parar processos Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Encontrados $($nodeProcesses.Count) processos Node.js em execução." -ForegroundColor Yellow
    
    # Parar cada processo
    foreach ($process in $nodeProcesses) {
        Write-Host "Parando processo Node.js (PID: $($process.Id))..." -ForegroundColor Cyan
        Stop-Process -Id $process.Id -Force
    }
    
    Write-Host "Todos os processos Node.js foram encerrados." -ForegroundColor Green
} else {
    Write-Host "Nenhum processo Node.js encontrado em execução." -ForegroundColor Yellow
}

Write-Host "Servidores parados com sucesso!" -ForegroundColor Green 