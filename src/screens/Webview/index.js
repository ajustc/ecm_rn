import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {CALLBACK_FINISH} from '../../services/constants';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ...
const WebviewPayment = props => {
  const {params} = props.route;

  const navigation = useNavigation();

  const handleNavigationStateChange = event => {
    console.log({event});
    console.log({event: event.url});
    if (event.url.includes(CALLBACK_FINISH)) {
      console.log('OK!____________________________');

      if (params.order_id !== 0) {
        navigation.replace('OrderDetail', {
          redirect: params.redirect,
          id: params.order_id,
        });
      } else {
        navigation.replace('OrderHistory');
      }

      AsyncStorage.clear();
    }
  };

  return (
    <WebView
      source={{
        uri: params.redirect,
        headers: {
          'ngrok-skip-browser-warning': '69420',
        },
      }}
      onNavigationStateChange={event => handleNavigationStateChange(event)}
      style={{flex: 1}}
    />
  );
};

export default WebviewPayment;
