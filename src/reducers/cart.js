/* eslint-disable no-undef */
import {ADD_TO_CART, LOGOUT} from '../actions/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCart = AsyncStorage.getItem('cart');

var initialState = [];
getCart.then(asd => {
  initialState = asd === null ? [] : asd;
});

const updateQuantity = (item, qtyyy) =>
  item.qty ? {...item, qty: Number(item.qty) + Number(qtyyy)} : {...item, qty: 2};

export default cart = (state = initialState, action, qtyyy) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_TO_CART:
      console.log('_____REDUCERS_____');
      console.log({payload});

      const productInCart = state.find(
        item => item.product_id === payload.product_id,
      );
      console.log({productInCart});
      if (!productInCart) {
        return [...state, payload];
      }
      return state.map(item => {
        if (item.product_id === payload.product_id) {
          return updateQuantity(item, qtyyy);
        }
        console.log({item});
        return item;
      });

    default:
      return state;
  }
};
