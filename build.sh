#!/bin/bash

# Script para build do frontend no Vercel

echo "=== Iniciando build do frontend ==="

# Navegar para o diretório frontend
cd frontend

# Instalar dependências
echo "Instalando dependências..."
npm install

# Executar build
echo "Executando build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "Build concluído com sucesso!"
  echo "Arquivos gerados em frontend/dist/"
else
  echo "Erro durante o build!"
  exit 1
fi 