import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import Axios from 'axios';

import {API_URL} from './../../services/constants';

import Product from './../../components/Product';
import Navbar from './../../components/Navbar';

const Home = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    await Axios.get(`${API_URL}api/auth/product/index`)
      .then(success => {
        const response = success.data.data
        setProducts(response);
        console.log({API_PRODUCT: response});
      })
      .catch(error => {
        console.log({API_PRODUCT: error});
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
        <SafeAreaView>
          <ScrollView>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {loading ? (
                <Text style={tw`font-bold text-center`}>Loading</Text>
              ) : (
                products.map(product => {
                  console.log({product});
                  return (
                    <Product
                      key={product.product_id ?? ''}
                      product_id={product.product_id ?? ''}
                      product_name={product.product_name ?? ''}
                      product_slug={product.product_slug ?? ''}
                      product_picture={product.product_picture ?? ''}
                      product_price={product.product_price ?? ''}
                      product_weight={Number(product.product_weight) ?? ''}
                      product_discount={Number(product.product_discount) ?? ''}
                    />
                  );
                })
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

export default Home;
