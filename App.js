import React from 'react';
import NavigationProvider from './src/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';

const App = () => {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <NavigationProvider />
      </SafeAreaProvider>
    </StoreProvider>
  );
};
export default App;
