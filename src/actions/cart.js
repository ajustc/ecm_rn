import AsyncStorage from '@react-native-async-storage/async-storage';

import {ADD_TO_CART} from './type';
import CartService from '../services/cartService';

export const __addToCart = data => dispatch => {
  return CartService.doAddToCart(data)
    .then(response => {
      console.log('_____ACTIONS_____');
      console.log({data: response});

      if (response.status === 'success') {
        dispatch({
          type: ADD_TO_CART,
          payload: response.data,
        });
        Promise.resolve();

        return response;
      }
    })
    .catch(error => {
      console.log('_____ACTIONS_____');
      console.log({error});
      Promise.reject();

      return error;
    });
};
