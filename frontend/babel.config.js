module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            components: './src/components',
            screens: './src/screens',
            navigation: './src/navigation',
            services: './src/services',
            utils: './src/utils',
            hooks: './src/hooks',
            types: './src/types',
            assets: './assets'
          }
        }
      ]
    ]
  };
};