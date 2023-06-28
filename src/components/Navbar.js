import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icons from 'react-native-heroicons/solid';
import tw from 'twrnc';

const Navbar = props => {
  const {btnCart = true, btnLogout = true} = props;
  const navigation = useNavigation();

  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      if (!currentUser) {
        setDataUser({
          isLoggedIn: false,
        });
      } else {
        setDataUser(currentUser);
      }
    } catch (error) {
      console.log({getUser: error});
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [cartState, setCartState] = useState([]);

  const getCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      const currentCart = JSON.parse(savedCart);

      if (!currentCart) {
        setCartState();
      } else {
        setCartState(currentCart);
      }
    } catch (error) {
      console.log({getCart: error});
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <View>
      <View
        style={tw`flex-row justify-between bg-pink-400 py-[12px] px-[10px]`}>
        <Text style={tw`text-[25px] text-white`}>JUSTC</Text>
        <View style={tw`text-[20px] flex-row mr-[30px]`}>
          {btnCart !== false ? (
            <TouchableOpacity
              style={tw`text-[20px] self-center mr-[10px]`}
              onPress={() => navigation.push('CartScreen')}>
              {/* onPress={() => removeCart()}> */}
              <Icons.ShoppingCartIcon size={22} color={'white'} />
              <Text
                style={tw`text-[17px] font-bold border-[1px] text-gray-400 border-[#CDE990] bg-[#CDE990] rounded-full text-center absolute w-full left-3 bottom-3`}>
                {cartState?.length ?? 0}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={tw`text-[20px] flex-row mt-1`}>
          {dataUser.isLoggedIn ? (
            <TouchableOpacity
              style={tw`text-[20px] flex-row`}
              onPress={() => navigation.push('ProfileScreen')}>
              {/* onPress={() => onLogout()}> */}
              <Icons.UserCircleIcon size={26} color={'white'} />
            </TouchableOpacity>
          ) : !dataUser.isLoggedIn || btnLogout !== false ? (
            <TouchableOpacity
              style={tw`text-[20px] flex-row`}
              onPress={() => navigation.push('LoginScreen')}>
              {/* <Text>{user.user.name}</Text> */}
              <Icons.ArrowRightOnRectangleIcon size={22} color={'white'} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default Navbar;
