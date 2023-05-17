/* eslint-disable no-undef */
import {ADD_TO_CART, LOGOUT} from '../actions/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCart = AsyncStorage.getItem('cart');

var initialState = [];
getCart.then(asd => {
  initialState = asd === null ? [] : asd;
});

const updateQuantity = item =>
  item.qty ? {...item, qty: item.qty + 1} : {...item, qty: 2};

export default cart = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_TO_CART:
      console.log('_____REDUCERS_____');
      console.log({payload});

      // if (state.length === 0) {
        const productInCart = state.find(
          item => item.product_id === payload.product_id,
        );
        if (!productInCart) {
          return [...state, payload];
        }
      // } else {
        return state.map(item => {
          if (item.product_id === payload.product_id) {
            return updateQuantity(item);
          }
          console.log({item});
          return item;
        });

        // res = state.map(item => {
        //   console.log({ITEMMMM: item});
        //   console.log({PAYLOADDD: payload});
        //   if (item.product_id !== payload.product_id) {
        //     return payload;
        //   }
        // });

        // console.log({res});
        // return state;
      // }
      // return;

    default:
      return state;
  }
};
