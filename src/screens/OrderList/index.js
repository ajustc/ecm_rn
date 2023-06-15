import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

import Navbar from '../../components/Navbar';
import axios from 'axios';
import {API_URL} from '../../services/constants';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderList = () => {
  const [dataHistory, setDataHistory] = useState([]);

  const navigation = useNavigation();

  const user = useSelector(state => state.user);

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      setDataUser(currentUser);
      console.log({currentUser});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  
  const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

  const GetOrderList = async () => {
    await axios
      .get(`${API_URL}api/auth/order/showbyuserid/${dataUser?.user?.data?.uid}`, {
        headers: {
          Authorization: `Bearer ${dataUser.access_token}`,
        },
      })
      .then(success => {
        const response = success?.data ?? [];
        setDataHistory(response);
      })
      .catch(error => {
        console.log({GetOrderList: error});
      });
  };

  useEffect(() => {
    GetOrderList();
  }, []);

  const navigateOrderDetail = (status, id) => {
    console.log({status});
    console.log({id});

    navigation.push('OrderDetail', {
      status,
      id,
    });
  };

  return (
    <View>
      <Navbar />
      {dataHistory.length > 0 ? (
        dataHistory.map(item => (
          <View key={item.order_id} style={tw`bg-pink-100 py-[18px] px-[12px] shadow`}>
            <View style={tw`flex flex-row justify-between items-center`}>
              <View>
                <Text>{item.order_purchase}</Text>
                <Text style={tw`font-semibold`}>{item.order_total}</Text>
              </View>

              <Text>{capitalize(item.order_status)}</Text>

              <TouchableOpacity
                onPress={() =>
                  navigateOrderDetail(item.order_status, item.order_id)
                }>
                <Text
                  style={tw`font-semibold bg-white py-[10px] px-[15px] rounded shadow`}>
                  Order List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View>
          <Text>No data history</Text>
        </View>
      )}
    </View>
  );
};

export default OrderList;
