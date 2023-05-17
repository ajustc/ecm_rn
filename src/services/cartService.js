import AsyncStorage from '@react-native-async-storage/async-storage';

const doAddToCart = async cart => {
  console.log('_____SERVICE_____');
  console.log({cart});

  const toCart = [cart];

  // AsyncStorage.setItem('cart', JSON.stringify(toCart));

  const getCart = await AsyncStorage.getItem('cart');
  // console.log({getCart});

  // getCart
  //   .then(asd => {
  //     console.log('ok');
  //     console.log({status});
  //     return {status, message, data};
  //   })
  //   .catch(error => {
  //     console.log('fail');
  //     status = 'failed';
  //     message = 'Shit! ' + error.toString();
  //     data = {};
  //   });

  return {
    status: 'success',
    message: 'Success add to cart',
    data: cart,
  };
};

export default {
  doAddToCart,
};
