import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

// Importações a serem implementadas
// import { store } from './src/store';
// import AppNavigator from './src/navigation/AppNavigator';
// import { theme } from './src/styles/theme';

export default function App() {
  return (
    // <ReduxProvider store={store}>
    //   <PaperProvider theme={theme}>
    //     <SafeAreaProvider>
    //       <NavigationContainer>
    //         <AppNavigator />
    //         <StatusBar style="auto" />
    //       </NavigationContainer>
    //     </SafeAreaProvider>
    //   </PaperProvider>
    // </ReduxProvider>
    
    // Versão temporária até implementar os componentes
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <PaperProvider>
        <NavigationContainer>
          {/* Conteúdo temporário */}
          <SafeAreaProvider style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar style="auto" />
            <h1>FitLife App</h1>
            <p>Bem-vindo ao aplicativo FitLife!</p>
            <p>Este é um aplicativo de treinos e fitness para ajudar você a alcançar seus objetivos.</p>
          </SafeAreaProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}