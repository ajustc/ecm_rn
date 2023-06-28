import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

import Navbar from '../../components/Navbar';
import axios from 'axios';
import {API_URL} from '../../services/constants';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderList = props => {
  const {firedHistoryFromWebview = false} = props.route.params;

  const navigation = useNavigation();

  const [firedHistory, setFiredHistory] = useState(firedHistoryFromWebview);

  const [userToken, setUserToken] = useState();

  const [dataUser, setDataUser] = useState();

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      const uid = currentUser?.user?.data?.uid
      const token = currentUser?.access_token

      setUserToken(token)
      setDataUser(currentUser);

      GetOrderList(token, uid);
    } catch (error) {
      console.log({getUser: error});
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

  const [dataHistory, setDataHistory] = useState([]);

  const GetOrderList = async (token, uid) => {
    await axios
      .get(
        `${API_URL}api/auth/order/showbyuserid/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(success => {
        const response = success?.data ?? [];
        setDataHistory(response);
      })
      .catch(error => {
        console.log({GetOrderList: error});
      });
  };

  const navigateOrderDetail = (status, id, token) => {
    navigation.push('OrderDetail', {
      status,
      id,
      token
    });
  };

  return (
    <View>
      <Navbar />
      {dataHistory.length > 0 ? (
        dataHistory.map(item => {
          return (
            <View
              key={item.order_id}
              style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
              <View style={tw`flex flex-row justify-between items-center`}>
                <View>
                  <Text>{item.order_purchase}</Text>
                  <Text style={tw`font-semibold`}>Rp. {item.order_total}</Text>
                </View>

                <Text>{capitalize(item.order_status)}</Text>

                <TouchableOpacity
                  onPress={() =>
                    navigateOrderDetail(item.order_status, item.order_id, userToken)
                  }>
                  <Text
                    style={tw`font-semibold bg-white py-[10px] px-[15px] rounded shadow`}>
                    Order List
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <View>
          <Text>No data history</Text>
        </View>
      )}
    </View>
  );
};

export default OrderList;
