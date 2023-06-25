import AsyncStorage from '@react-native-async-storage/async-storage';

const updateQuantity = (item, qtyyy) =>
  item.qty ? {...item, qty: Number(item.qty) + Number(qtyyy)} : {...item, qty: 2};

const doAddToCart = async (cart, qty) => {
  console.log('_____SERVICE_____');
  console.log({cart});

  const cartData = await AsyncStorage.getItem('cart');

  let cartItems = [];
  if (cartData) {
    cartItems = JSON.parse(cartData);
  }

  const productInCart = cartItems.findIndex(
    item => item.product_id === cart.product_id,
  );

  console.log({productInCart});

  if (productInCart === -1) {
    cartItems.push(cart);
  } else {
    const existingItem = cartItems[productInCart];
    const updatedItem = updateQuantity(existingItem, qty);
    cartItems[productInCart] = updatedItem;
  }

  // Add new item to cart
  // cartItems.push(cart);

  // Save updated cart data
  await AsyncStorage.setItem('cart', JSON.stringify(cartItems));

  return {
    status: 'success',
    message: 'Success add to cart',
    data: cart,
  };
};

export default {
  doAddToCart,
};
