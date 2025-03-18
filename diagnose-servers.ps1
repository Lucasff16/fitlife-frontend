# Script para diagnosticar problemas nos servidores do Projeto Fitness
Write-Host "Diagnosticando servidores do Projeto Fitness..." -ForegroundColor Cyan

# Verificar versão do Node.js
try {
    $nodeVersion = node -v
    Write-Host "Node.js instalado: $nodeVersion" -ForegroundColor Green
    
    # Verificar se a versão é compatível (v18.20.7 ou superior)
    $versionString = $nodeVersion.Replace('v', '')
    $versionParts = $versionString.Split('.')
    $majorVersion = [int]$versionParts[0]
    $minorVersion = [int]$versionParts[1]
    
    if ($majorVersion -lt 18 -or ($majorVersion -eq 18 -and $minorVersion -lt 20)) {
        Write-Host "AVISO: Versão do Node.js abaixo da recomendada (v18.20.7). Considere atualizar." -ForegroundColor Yellow
    }
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
    try {
        $processName = (Get-Process -Id $backendPortInUse[0].OwningProcess).ProcessName
        Write-Host "  Processo: $processName" -ForegroundColor Yellow
    } catch {
        Write-Host "  Não foi possível identificar o processo" -ForegroundColor Yellow
    }
} else {
    Write-Host "Porta $backendPort (backend) está disponível" -ForegroundColor Green
}

if ($frontendPortInUse) {
    Write-Host "AVISO: Porta $frontendPort (frontend) já está em uso pelo processo com PID $($frontendPortInUse[0].OwningProcess)" -ForegroundColor Yellow
    try {
        $processName = (Get-Process -Id $frontendPortInUse[0].OwningProcess).ProcessName
        Write-Host "  Processo: $processName" -ForegroundColor Yellow
    } catch {
        Write-Host "  Não foi possível identificar o processo" -ForegroundColor Yellow
    }
} else {
    Write-Host "Porta $frontendPort (frontend) está disponível" -ForegroundColor Green
}

# Verificar arquivos de configuração
Write-Host "`nVerificando arquivos de configuração:" -ForegroundColor Cyan

$backendEnv = Test-Path -Path "$PSScriptRoot\backend\.env"
if ($backendEnv) {
    Write-Host "Arquivo .env do backend encontrado" -ForegroundColor Green
    
    # Verificar conteúdo do .env do backend
    $envContent = Get-Content -Path "$PSScriptRoot\backend\.env" -ErrorAction SilentlyContinue
    if ($envContent) {
        $hasMongoUri = $envContent | Where-Object { $_ -match "MONGODB_URI" }
        $hasJwtSecret = $envContent | Where-Object { $_ -match "JWT_SECRET" }
        
        if (-not $hasMongoUri) {
            Write-Host "  AVISO: MONGODB_URI não encontrado no .env do backend" -ForegroundColor Yellow
        }
        
        if (-not $hasJwtSecret) {
            Write-Host "  AVISO: JWT_SECRET não encontrado no .env do backend" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "ERRO: Arquivo .env do backend não encontrado!" -ForegroundColor Red
    Write-Host "  Crie o arquivo .env no diretório backend com base no .env.example" -ForegroundColor Yellow
}

$frontendEnv = Test-Path -Path "$PSScriptRoot\frontend\.env"
if ($frontendEnv) {
    Write-Host "Arquivo .env do frontend encontrado" -ForegroundColor Green
    
    # Verificar conteúdo do .env do frontend
    $envContent = Get-Content -Path "$PSScriptRoot\frontend\.env" -ErrorAction SilentlyContinue
    if ($envContent) {
        $hasApiUrl = $envContent | Where-Object { $_ -match "VITE_API_URL" }
        
        if (-not $hasApiUrl) {
            Write-Host "  AVISO: VITE_API_URL não encontrado no .env do frontend" -ForegroundColor Yellow
        } else {
            $apiUrl = ($envContent | Where-Object { $_ -match "VITE_API_URL" }).Split('=')[1].Trim()
            Write-Host "  API URL configurada: $apiUrl" -ForegroundColor Green
            
            # Verificar se a URL da API está correta
            if (-not $apiUrl.Contains("localhost:4000")) {
                Write-Host "  AVISO: VITE_API_URL pode estar incorreto. Valor esperado: http://localhost:4000/api" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "ERRO: Arquivo .env do frontend não encontrado!" -ForegroundColor Red
    Write-Host "  Crie o arquivo .env no diretório frontend com base no .env.example" -ForegroundColor Yellow
}

# Verificar dependências
Write-Host "`nVerificando dependências:" -ForegroundColor Cyan

$backendNodeModules = Test-Path -Path "$PSScriptRoot\backend\node_modules"
if ($backendNodeModules) {
    Write-Host "Dependências do backend instaladas" -ForegroundColor Green
    
    # Verificar package.json do backend
    $backendPackageJson = Test-Path -Path "$PSScriptRoot\backend\package.json"
    if ($backendPackageJson) {
        $packageContent = Get-Content -Path "$PSScriptRoot\backend\package.json" -Raw | ConvertFrom-Json
        Write-Host "  Versão do backend: $($packageContent.version)" -ForegroundColor Green
        Write-Host "  Scripts disponíveis: $($packageContent.scripts.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
    }
} else {
    Write-Host "AVISO: Dependências do backend não encontradas!" -ForegroundColor Yellow
    Write-Host "  Execute 'npm install' no diretório backend" -ForegroundColor Yellow
}

$frontendNodeModules = Test-Path -Path "$PSScriptRoot\frontend\node_modules"
if ($frontendNodeModules) {
    Write-Host "Dependências do frontend instaladas" -ForegroundColor Green
    
    # Verificar package.json do frontend
    $frontendPackageJson = Test-Path -Path "$PSScriptRoot\frontend\package.json"
    if ($frontendPackageJson) {
        $packageContent = Get-Content -Path "$PSScriptRoot\frontend\package.json" -Raw | ConvertFrom-Json
        Write-Host "  Versão do frontend: $($packageContent.version)" -ForegroundColor Green
        Write-Host "  Scripts disponíveis: $($packageContent.scripts.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
    }
} else {
    Write-Host "AVISO: Dependências do frontend não encontradas!" -ForegroundColor Yellow
    Write-Host "  Execute 'npm install' no diretório frontend" -ForegroundColor Yellow
}

# Verificar conectividade com o backend
Write-Host "`nVerificando conectividade:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$backendPort/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "Backend está respondendo corretamente" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Backend está respondendo, mas com status $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO: Não foi possível conectar ao backend na porta $backendPort" -ForegroundColor Red
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
    
    # Criar arquivos .env se necessário
    if (-not $backendEnv) {
        Write-Host "Criando arquivo .env do backend..." -ForegroundColor Yellow
        $backendEnvExample = Test-Path -Path "$PSScriptRoot\backend\.env.example"
        if ($backendEnvExample) {
            Copy-Item -Path "$PSScriptRoot\backend\.env.example" -Destination "$PSScriptRoot\backend\.env"
            Write-Host "  Arquivo .env do backend criado com base no .env.example" -ForegroundColor Green
        } else {
            @"
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/fitness?retryWrites=true&w=majority
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRE=30d
"@ | Out-File -FilePath "$PSScriptRoot\backend\.env" -Encoding utf8
            Write-Host "  Arquivo .env do backend criado com valores padrão" -ForegroundColor Green
            Write-Host "  ATENÇÃO: Edite o arquivo .env do backend e configure as credenciais do MongoDB" -ForegroundColor Yellow
        }
    }
    
    if (-not $frontendEnv) {
        Write-Host "Criando arquivo .env do frontend..." -ForegroundColor Yellow
        $frontendEnvExample = Test-Path -Path "$PSScriptRoot\frontend\.env.example"
        if ($frontendEnvExample) {
            Copy-Item -Path "$PSScriptRoot\frontend\.env.example" -Destination "$PSScriptRoot\frontend\.env"
            Write-Host "  Arquivo .env do frontend criado com base no .env.example" -ForegroundColor Green
        } else {
            @"
VITE_USE_REAL_API=true
VITE_API_URL=http://localhost:4000/api
VITE_NODE_ENV=development
VITE_PORT=5174
"@ | Out-File -FilePath "$PSScriptRoot\frontend\.env" -Encoding utf8
            Write-Host "  Arquivo .env do frontend criado com valores padrão" -ForegroundColor Green
        }
    }
    
    Write-Host "`nCorreção automática concluída!" -ForegroundColor Green
    Write-Host "Agora você pode iniciar os servidores com o script start-servers.ps1" -ForegroundColor Cyan
} 