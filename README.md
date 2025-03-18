# FitLife Frontend

Aplicação frontend do FitLife, desenvolvida com React Native e Expo para web e mobile.

## Tecnologias Utilizadas

- React v18.2.0
- React Native com Expo
- Vite para desenvolvimento web
- Redux Toolkit para gerenciamento de estado
- React Navigation para navegação
- Styled Components para estilização
- React Hook Form para formulários

## Estrutura do Projeto

```
frontend/
├── assets/           # Imagens, fontes e outros recursos estáticos
├── src/
│   ├── api/          # Configuração e chamadas de API
│   ├── components/   # Componentes reutilizáveis
│   ├── contexts/     # Contextos React
│   ├── hooks/        # Hooks personalizados
│   ├── navigation/   # Configuração de navegação
│   ├── screens/      # Telas da aplicação
│   ├── services/     # Serviços e lógica de negócio
│   ├── store/        # Configuração do Redux
│   ├── styles/       # Estilos globais e temas
│   ├── types/        # Definições de tipos TypeScript
│   ├── utils/        # Funções utilitárias
│   ├── App.tsx       # Componente principal
│   └── main.tsx      # Ponto de entrada
├── .env              # Variáveis de ambiente (não versionado)
├── .env.example      # Exemplo de variáveis de ambiente
├── app.json          # Configuração do Expo
└── package.json      # Dependências e scripts
```

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar em modo desenvolvimento para web
npm run web

# Iniciar em modo desenvolvimento para dispositivos móveis
npm start
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor Expo
- `npm run web`: Inicia a aplicação no navegador
- `npm run android`: Inicia a aplicação no Android
- `npm run ios`: Inicia a aplicação no iOS
- `npm run check-react`: Verifica a versão do React
- `npm run fix-blank-screen`: Corrige problemas de tela branca

## Funcionalidades Principais

- Autenticação de usuários
- Visualização e gerenciamento de treinos
- Criação de treinos personalizados
- Acompanhamento de progresso
- Favoritar treinos
- Modo offline

## Compatibilidade

- Web (navegadores modernos)
- iOS 13+
- Android 6.0+

## Licença

MIT