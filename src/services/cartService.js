import AsyncStorage from '@react-native-async-storage/async-storage';

const doAddToCart = async cart => {
  console.log('_____SERVICE_____');
  console.log({cart});

  const cartData = await AsyncStorage.getItem('cart');

  let cartItems = [];
  if (cartData) {
    cartItems = JSON.parse(cartData);
  }

  // Add new item to cart
  cartItems.push(cart);

  // Save updated cart data
  await AsyncStorage.setItem('cart', JSON.stringify(cartItems));

  // AsyncStorage.setItem('cart', JSON.stringify(cart));

  return {
    status: 'success',
    message: 'Success add to cart',
    data: cart,
  };
};

export default {
  doAddToCart,
};
