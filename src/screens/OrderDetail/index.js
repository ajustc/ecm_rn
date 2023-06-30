import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {API_URL} from '../../services/constants';
import tw from 'twrnc';
import Navbar from '../../components/Navbar';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetail = props => {
  const {status, id, token} = props.route.params;

  const navigation = useNavigation();

  const [dataOrderList, setDataOrderList] = useState();
  const [dataOrderDetail, setDataOrderDetail] = useState();

  const user = useSelector(state => state.user);
  // const dataUser = user;

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      setDataUser(currentUser);
      console.log({GetUser: currentUser});
    } catch (error) {
      console.log({GetUser: error});
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const currentDate = new Date();
  const newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day in milliseconds
  const nextDay =
    newDate.getFullYear() +
    '-' +
    ('00' + (newDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + newDate.getDate()).slice(-2) +
    ' ' +
    ('00' + newDate.getHours()).slice(-2) +
    ':' +
    ('00' + newDate.getMinutes()).slice(-2) +
    ':' +
    ('00' + newDate.getSeconds()).slice(-2);

  const nowDate =
    currentDate.getFullYear() +
    '-' +
    ('00' + (currentDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + currentDate.getDate()).slice(-2) +
    ' ' +
    ('00' + currentDate.getHours()).slice(-2) +
    ':' +
    ('00' + currentDate.getMinutes()).slice(-2) +
    ':' +
    ('00' + currentDate.getSeconds()).slice(-2);

  const GetOrderList = async () => {
    axios
      .get(`${API_URL}api/auth/user/order/show/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(success => {
        const response = success.data;
        setDataOrderList(response[0]);

        console.log({GetOrderList: response[0]});
      })
      .catch(error => {
        console.log({GetOrderList: error});
      });
  };

  const GetOrderDetail = async () => {
    axios
      .get(`${API_URL}api/auth/order/detail/show/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(success => {
        const response = success.data;
        setDataOrderDetail(response);

        console.log({GetOrderDetail: response});
      })
      .catch(error => {
        console.log({GetOrderDetail: error});
      });
  };

  useEffect(() => {
    GetOrderList();
    GetOrderDetail();
  }, []);

  const navigateToWebview = () => {
    navigation.replace('WebviewScreen', {
      redirect: dataOrderList?.order_redirect_url,
      order_id: dataOrderList?.order_id,
    });
  };

  return (
    <View style={{flex: 1}}>
      <Navbar />

        <ScrollView>
          <View style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
            <Text style={tw`font-bold`}>ORDER DETAIL : </Text>
          </View>

          <View>
            {dataOrderList?.order_status === 'paid' &&
            dataOrderList?.status === 'settlement' ? (
              <Text style={tw`bg-green-100 text-center py-5 font-bold`}>
                Thank you for purchase in apps.
              </Text>
            ) : dataOrderList?.order_status === 'paid' &&
              dataOrderList?.status === 'pending' ? (
              <TouchableOpacity onPress={navigateToWebview}>
                <Text style={tw`bg-blue-200 text-center py-5 font-bold`}>
                  Please Proceed To Payment Again
                </Text>
              </TouchableOpacity>
            ) : nowDate < nextDay ? (
              <TouchableOpacity onPress={navigateToWebview}>
                <Text style={tw`bg-blue-200 text-center py-5 font-bold`}>
                  Proceed To Payment
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={tw`bg-yellow-100 text-center py-5 font-bold`}>
                Your order has been failed.
              </Text>
            )}
          </View>

          {dataOrderList && (
            <>
              <View style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
                <Text style={tw`text-lg text-black font-semibold`}>
                  Purchase
                </Text>
                <Text style={tw`text-base`}>{dataOrderList?.number}</Text>
                <Text style={tw`text-base`}>
                  {dataOrderList?.order_purchase}
                </Text>
                <Text style={tw`text-base`}>
                  Rp.{dataOrderList?.order_total}
                </Text>
              </View>

              <View style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
                <Text style={tw`text-lg text-black font-semibold`}>
                  Customer
                </Text>
                <Text style={tw`text-base`}>{dataOrderList?.name}</Text>
                <Text style={tw`text-base`}>{dataOrderList?.address}</Text>
                <Text style={tw`text-base`}>{dataOrderList?.email}</Text>
              </View>

              <View style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
                <Text style={tw`text-lg text-black font-semibold`}>
                  Delivery
                </Text>
                <Text style={tw`text-base`}>
                  {dataOrderList?.order_expedition}
                </Text>
                <Text style={tw`text-base`}>
                  Rp.{dataOrderList?.order_shipping_cost}
                </Text>
                <Text style={tw`text-base`}>
                  {dataOrderList?.order_address}
                </Text>
              </View>
            </>
          )}

          {dataOrderDetail?.length > 0 ? (
            dataOrderDetail.map(item => {
              const firstProduct = item.product_picture.split(',')[0] ?? [];
              return (
                <View
                  key={item.product_id}
                  style={tw`bg-white shadow rounded-lg p-5 my-5`}>
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
        </ScrollView>
    </View>
  );
};

export default OrderDetail;
