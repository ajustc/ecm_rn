import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './../screens/Home/index';
import Login from './../screens/Login/index';
import Register from './../screens/Register/index';
import Profile from './../screens/Profile/index';
import ProfileEdit from './../screens/ProfileEdit/index';
import Cart from './../screens/Cart/index';
import Checkout from './../screens/Checkout/index';
import OrderList from './../screens/OrderList/index';
import OrderDetail from './../screens/OrderDetail/index';

import Webview from './../screens/Webview/index';
import ProductDetailScreen from '../screens/ProductDetail';

const Stack = createNativeStackNavigator();

const Routing = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LoginScreen"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEdit}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CartScreen"
        component={Cart}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={Checkout}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="WebviewScreen"
        component={Webview}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const NavigationProvider = () => {
  return <Routing />;
};

export default NavigationProvider;
