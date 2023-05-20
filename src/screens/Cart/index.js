/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import {NumberFormat, NumberFormatBase} from 'react-number-format';
import Axios from 'axios';
import {AsyncStorage} from '@react-native-async-storage/async-storage';
import {API_URL} from './../../services/constants';
import {useSelector} from 'react-redux';
import Navbar from './../../components/Navbar';
import tw from 'twrnc';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Cart = ({route}) => {
  const navigation = useNavigation();

  const [nomor, setNomor] = useState(1);

  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  const [dataAmountCheckout, setDataAmountCheckout] = useState(0);
  const [dataCheckout, setDataCheckout] = useState([]);

  useEffect(() => {
    var totalAmount = 0;
    var calculateAmount = 0;
    cart.forEach(element => {
      const amount = element.product_price * element.qty;

      totalAmount = calculateAmount += amount;
    });
    setDataAmountCheckout(totalAmount);
    console.log({dataAmountCheckout});
  }, [dataAmountCheckout]);

  const numberOfItemsPerPageList = [1];
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, cart?.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const fetchProduk = async () => {
    // const logtoken = await AsyncStorage.getItem('Logtoken-token');
    // const cart = await AsyncStorage.getItemo('Keranjang');
    // Axios.get(
    //   `${API_URL}/apiproduk/?id_produk=${route.params?.id_produk}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${logtoken}`,
    //     },
    //   },
    // ).then(res => {
    //   console.log('res fetchproduk : ', res.data.data);
    //   setCart(cart);
    // });
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const getdata = async () => {
    // const cart = await AsyncStorage.getItemo('Keranjang');
    console.log('wkowdwd', JSON.stringify(cart));
    // console.log(cart.produk.harga);
  };

  const removeitem = async () => {
    // const cart1 = await AsyncStorage.removeItem('Keranjang-id');
    // const cart2 = await AsyncStorage.removeItem('Keranjang-jm');
    // const cart3 = await AsyncStorage.removeItem('Keranjang');
    // console.log(cart1, cart2, cart3);
  };

  const indFormatCurrency = props => {
    const format = numStr => {
      if (numStr === '') return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        //   maximumFractionDigits: 0,
      }).format(numStr);
    };

    return <NumberFormatBase {...props} format={format} />;
  };

  return (
    <View style={tw`flex-1`}>
      <Navbar />
      {/* <Button onPress={getdata} title="testttt" />
      <Button onPress={removeitem} title="removee keranjang" /> */}

      <SafeAreaView>
        <ScrollView>
          <View style={tw`mt-5`}>
            {cart?.length > 0 ? (
              cart.map(item => {
                const firstProduct = item.product_picture.split(',')[0] ?? [];
                return (
                  <View
                    key={item.product_id}
                    style={tw`bg-white shadow rounded-lg p-5 mb-5`}>
                    <View style={tw`flex flex-row mb-4`}>
                      <Image
                        style={tw`w-[60px] h-[60px]`}
                        source={{
                          uri: `${API_URL}storage/product/${firstProduct}`,
                        }}
                      />
                      <Text
                        style={tw`text-black font-semibold ml-4 flex-1 flex-wrap`}>
                        {item.product_name}
                      </Text>
                    </View>
                    <Text style={tw`text-black`}>
                      Price : Rp{item.product_price}
                    </Text>
                    <Text style={tw`text-black`}>Quantity : {item.qty}</Text>
                    <Text style={tw`text-black`}>
                      Sub Price : Rp{item.product_price * item.qty}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={tw`text-red-500 text-[22px] text-center p-5`}>
                NoData
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={tw`bg-white shadow-md absolute bottom-0 w-full`}>
        <View style={tw`flex flex-row justify-between`}>
          <Text style={tw`text-black font-semibold p-5`}>
            Amount: Rp{dataAmountCheckout}
          </Text>
          <TouchableOpacity onPress={() => navigation.push('CheckoutScreen')}>
            <Text
              style={tw`text-black font-semibold p-5 text-white shadow w-[140px] text-center bg-pink-400`}>
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Cart;
