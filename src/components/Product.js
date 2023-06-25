import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Axios from 'axios';
import NumberFormat from 'react-number-format';
import tw from 'twrnc';

import {useDispatch, useSelector} from 'react-redux';
import {__addToCart} from './../actions/cart';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, STORAGE_URL} from './../services/constants';

const Product = props => {
  const {
    product_id,
    product_name,
    product_slug,
    product_picture,
    product_price,
    product_weight,
    product_discount,
  } = props;
  const [cartItems, setCartItems] = useState([]);

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const arrayProduk = product_picture.split(',') ?? [];

  const addToCart = item => {
    dispatch(__addToCart(item))
      .then(response => {
        if (response.status === 'success') {
          // setCartItems([...cartItems, item]);
        }
      })
      .catch(error => {
        console.log({product: error});
      });
  };

  useEffect(() => {
    // console.log({cartItems});
  }, [cartItems]);

  return (
    <View
      style={tw`flex-col w-[180px] mx-2 mb-5 bg-white rounded-lg shadow-lg`}>
      <TouchableOpacity
        onPress={() =>
          navigation.push('ProductDetailScreen', {
            product_id,
            product_name,
            product_slug,
            product_picture,
            product_price,
            product_weight,
            product_discount,
          })
        }>
        <Image
          style={tw`w-[180px] h-[180px]`}
          source={{
            uri: `${API_URL}storage/product/${arrayProduk[0]}`,
          }}
        />

        <View style={tw`p-5`}>
          <Text style={tw`text-[14px] text-black mb-4`}>
            {product_name.length > 40
              ? product_name?.slice(0, 42) + '...'
              : product_name}
          </Text>
          <View style={tw`flex justify-between`}>
            <NumberFormat
              value={product_price}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'Rp'}
              renderText={value => (
                <Text style={tw`text-lg text-red-500`}>{value}</Text>
              )}
            />
            <Text style={tw`text-xs text-black`}>100 terjual </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Product;
