import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

import {API_URL} from './../../services/constants';

import {logout} from './../../actions/auth';

import Product from './../../components/Product';
import Navbar from './../../components/Navbar';

const Home = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        navigation.replace('LoginScreen');
      }
    });
  };

  const getProducts = () => {
    Axios.get(`${API_URL}api/auth/product/index`).then(res => {
      setProducts(res.data.data);
      console.log('Get Index Produk', res.data);
    }).catch(err => {
      console.log({err});
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <View style={tw`flex mt-4 justify-center items-center`}>
        {/* <Text style={{fontSize: 16}}>Welcome {user.user}</Text> */}
        {/* <Button onPress={() => onLogout()} title="Logout" /> */}
        <View style={tw`flex-row flex-wrap justify-between`}>
          {loading ? (
            <Text style={tw`font-bold text-center`}>Loading</Text>
          ) : (
            products.map(product => {
              return (
                <Product
                  key={product.product_id ?? ''}
                  product_id={product.product_id ?? ''}
                  product_name={product.product_name ?? ''}
                  product_picture={product.product_picture ?? ''}
                  product_price={product.product_price ?? ''}
                />
              );
            })
          )}
        </View>
      </View>
    </>
  );
};

export default Home;
