const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          // Adicione aqui módulos que precisam ser transpilados
        ],
      },
    },
    argv
  );

  // Resolver problemas de compatibilidade
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Configuração de segurança CSP
  if (config.devServer) {
    config.devServer.headers = {
      ...config.devServer.headers,
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'self'",
    };
  }

  // Otimizações para produção
  if (env.mode === 'production') {
    // Adicione otimizações específicas para produção aqui
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        name: false,
      },
    };
  }

  return config;
};