import React from 'react';
import NavigationProvider from './src/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/store';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

const App = () => {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <AutocompleteDropdownContextProvider>
          <NavigationProvider />
        </AutocompleteDropdownContextProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
};
export default App;
