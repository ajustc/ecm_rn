import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {CALLBACK_FINISH} from '../../services/constants';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import queryString from 'query-string';

// ...
const WebviewPayment = props => {
  const {params} = props.route;

  console.log({params});

  const navigation = useNavigation();

  const handleNavigationStateChange = event => {
    console.log({event});
    console.log({event: event.url});

    if (event.url.includes(CALLBACK_FINISH)) {
      const url = queryString.parseUrl(event.url);
      const oid = Number(url.query.order_id);

      const orderId = params.order_id === 0 ? oid : params.order_id;

      console.log({url});
      console.log({orderId});
      console.log('OK!____________________________');

      navigation.replace('HomeScreen');

      if (orderId !== 0) {
        navigation.push('OrderDetail', {
          redirect: params.redirect,
          id: orderId,
          token: params.token
        });
      } else {
        navigation.push('OrderHistory', {
          firedHistoryFromWebview: true,
        });
      }

      AsyncStorage.removeItem('cart');
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
