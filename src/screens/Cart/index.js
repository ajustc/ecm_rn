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
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import {NumberFormat, NumberFormatBase} from 'react-number-format';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, STORAGE_URL} from './../../services/constants';
import {useSelector} from 'react-redux';
import Navbar from './../../components/Navbar';
import tw from 'twrnc';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Cart = ({route}) => {
  const navigation = useNavigation();

  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  const [modalAddress, setModalAddress] = useState(false);

  // const dataUser = user;
  // console.log({dataUserssssss: dataUser});

  const [firedCalculate, setFiredCalculate] = useState(false);

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const [optionalAddress, setOptionalAddress] = useState(
    dataUser?.user?.data?.address,
  );

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      setDataUser(currentUser);
      setOptionalAddress(currentUser?.user?.data?.address);
      console.log({currentUser});
    } catch (error) {
      console.log(error);
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
      setFiredCalculate(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, [cartState]);

  const [dataAmountCheckout, setDataAmountCheckout] = useState(0);
  const [dataWeightCheckout, setDataWeightCheckout] = useState(0);

  // ** request
  const [dataCoupon, setDataCoupon] = useState(false);
  const [dataCouponId, setDataCouponId] = useState(0);
  const [dataCouponName, setDataCouponName] = useState('');
  const [dataCouponDiscount, setDataCouponDiscount] = useState(0);

  const calculateWeightAmount = () => {
    console.log('calculateWeightAmount');
    var totalAmount = 0;
    var totalWeight = 0;

    var calculateAmount = 0;
    var calculateWeight = 0;

    if (cartState?.length > 0) {
      cartState.forEach(element => {
        const amount =
          discount(element.product_price, element.product_discount) *
          element.qty;
        const weight = element.product_weight * element.qty;

        totalAmount = calculateAmount += amount;
        totalWeight = calculateWeight += weight;
      });
    }

    setDataAmountCheckout(totalAmount);
    setDataWeightCheckout(totalWeight);
  };

  useEffect(() => {
    if (firedCalculate) {
      console.log('fired');
      calculateWeightAmount();
    }
  }, [firedCalculate]);

  const numberOfItemsPerPageList = [1];
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  );

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const GetCoupon = async () => {
    if (dataCouponName === '') {
      Alert.alert('Coupon', 'Apply coupon tidak boleh kosong');
      return;
    }

    await axios
      .get(`${API_URL}api/auth/coupon`, {
        params: {
          coupon: dataCouponName.toUpperCase(),
        },
      })
      .then(success => {
        const response = success.data;

        if (response.expired) {
          Alert.alert('Coupon', 'Coupon sudah expired');
        }

        if (!response.coupon) {
          Alert.alert('Coupon', 'Coupon tidak ditemukan');
        }

        console.log({response});

        setDataCoupon(true);
        setDataCouponId(response.coupon.coupon_id ?? 0);
        setDataCouponName(response.coupon.coupon_name ?? '');
        setDataCouponDiscount(response.coupon.coupon_discount);
      })
      .catch(error => {
        console.log({errorCoupon: error});
      });
  };

  const DoCheckout = () => {
    if (dataUser?.isLoggedIn === false || !dataUser) {
      Alert.alert('Pesan', 'Harap login terlebih dahulu', [
        {
          text: 'OK',
          onPress: () => navigation.replace('LoginScreen'),
        },
      ]);
      return;
    }

    const payloadDataRequest = {
      couponid: dataCouponId ?? null,
      couponvalue: dataCouponDiscount ?? null,
      totalOrder: dataAmountCheckout,
      address: optionalAddress,
      total_weight: dataWeightCheckout,
      province: '',
      district: '',
      type: '',
      postal_code: '',
      expedition: '',
      package: '',
      shipping_costs: 0,
      estimation: '',
    };
    console.log({payloadDataRequest});

    navigation.push('CheckoutScreen', {
      totalWeight: dataWeightCheckout,
      request: payloadDataRequest,
    });
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

  function discount(valuePrice, valueDiscount) {
    var total = (valuePrice * valueDiscount) / 100;
    var fix = valuePrice - total;
    return fix;
  }

  const removeItemCart = async (productId) => {
    console.log({productId});

    const existingCart = await AsyncStorage.getItem('cart');
    const thisCart = JSON.parse(existingCart);

    const cartItems = thisCart.filter(item => item.product_id !== productId);
    console.log({existingCart});
    console.log({thisCart});
    console.log({cartItems});

    await AsyncStorage.removeItem('cart');

    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
  }

  return (
    <View style={tw`flex-1`}>
      <Navbar btnCart={false} btnLogout={false} />

      <SafeAreaView>
        <ScrollView>
          <View style={tw`mt-5`}>
            {cartState?.length > 0 ? (
              cartState.map(item => {
                const firstProduct = item.product_picture.split(',')[0] ?? [];
                return (
                  <View
                    key={item.product_id}
                    style={tw`bg-white shadow rounded-lg p-5 mb-5`}>
                    <TouchableOpacity style={tw`absolute shadow p-2 bg-gray-700 w-9 text-center rounded mb-5 absolute z-999 right-2 top-2`} onPress={() => removeItemCart(item.product_id)}>
                      <Text
                        style={tw`text-white text-center`}
                        >
                        X
                      </Text>
                    </TouchableOpacity>

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
                    <Text
                      style={tw`text-black bg-gray-300 w-18 text-center py-2 my-2 rounded`}>
                      {item.product_size}
                    </Text>
                    <Text style={tw`text-black`}>
                      Price : Rp.{' '}
                      {discount(item.product_price, item.product_discount)}
                    </Text>
                    <Text style={tw`text-black`}>Quantity : {item.qty}</Text>
                    <Text style={tw`text-black`}>
                      Sub Price : Rp.{' '}
                      {discount(item.product_price, item.product_discount) *
                        item.qty}
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
        {/* COUPON */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAddress}
          onRequestClose={() => {
            setModalAddress(!modalAddress);
          }}>
          <View
            style={tw`bg-white border-[1px] border-gray-500 rounded shadow top-75 w-90 mx-auto`}>
            <TextInput
              style={tw`w-auto mx-2 px-3.5 text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
              value={optionalAddress}
              onChangeText={text => setOptionalAddress(text)}
              placeholder="optional address: komp. bintang blok 1 no. 1"
              placeholderTextColor="#808080"
              keyboardType="default"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity onPress={() => setModalAddress(false)}>
              <Text
                style={tw`mb-2 mx-2 ml-auto text-black font-semibold p-2 rounded text-white shadow w-[140px] text-center bg-blue-400`}>
                Save Address
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => setModalAddress(true)}>
          <Text
            style={tw`text-black font-semibold p-5 text-white shadow text-center bg-blue-400`}>
            Optional Address
          </Text>
        </TouchableOpacity>

        {/* COUPON */}
        <View style={tw`flex flex-row justify-between items-center`}>
          <View style={tw`ml-4 w-52`}>
            <TextInput
              style={tw`border-[1px] border-gray-400 rounded text-black ${
                dataCoupon ? 'bg-gray-200' : 'bg-white'
              }`}
              editable={!dataCoupon}
              placeholder="Coupon (Optional)"
              value={dataCouponName}
              onChangeText={text => {
                setDataCouponName(text.toUpperCase());
              }}
            />
          </View>
          <TouchableOpacity disabled={dataCoupon} onPress={() => GetCoupon()}>
            <Text
              style={tw`text-black font-semibold p-5 text-white shadow w-[140px] text-center ${
                !dataCoupon ? 'bg-pink-600' : 'bg-pink-900'
              }`}>
              Applied Coupon
            </Text>
          </TouchableOpacity>
        </View>

        {/* CHECKOUT */}
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text style={tw`text-black font-semibold p-5`}>
            Amount: Rp{dataAmountCheckout}
          </Text>
          <TouchableOpacity onPress={() => DoCheckout()}>
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
