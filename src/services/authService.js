import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import {API_URL} from './constants';

const logIn = async user => {
  console.log('user info', user);

  var status = '';
  var message = '';
  var data = '';

  await Axios.post(`${API_URL}api/auth/login`, user)
    .then(success => {
      console.log('then success');
      AsyncStorage.setItem('user', JSON.stringify(user));

      status  = 'success';
      message = 'You are redirecting to home page';
      data    = user;
    })
    .catch(error => {
      console.log('catch success');

      status  = 'failed';
      message = 'Shit! ' + error.toString();
    });

  return {status, message, data};
};

const logOut = async () => {
  AsyncStorage.clear();
  return {
    status: 'success',
    message: 'You are logged out',
  };
};

export default {
  logIn,
  logOut,
};
