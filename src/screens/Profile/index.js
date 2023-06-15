/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import {DataTable, Button} from 'react-native-paper';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

// services
import {API_URL} from './../../services/constants';

// components
import Navbar from './../../components/Navbar';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../actions/auth';

const Profile = props => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, []);

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
    console.log({dataUser});
  }, []);

  const GetOrderList = async () => {
    await axios
      .get(
        `${API_URL}api/auth/order/showbyuserid/${dataUser?.user?.data?.uid}`,
        {
          headers: {
            Authorization: `Bearer ${dataUser.access_token}`,
          },
        },
      )
      .then(success => {
        const response = success?.data ?? [];
        console.log({response});
      })
      .catch(error => {
        console.log({error});
      });
  };

  const navigateOrderHistory = () => {
    navigation.push('OrderHistory');
  };

  const navigateEditProfile = () => {
    navigation.push('ProfileEditScreen');
  };

  const dispatch = useDispatch();
  const navigateLogout = () => {
    dispatch(logout()).then(response => {
      if (response.status === 'success') {
        AsyncStorage.clear();
        navigation.replace('HomeScreen');
      }
    });
  };

  useEffect(() => {
    GetOrderList();
  }, []);

  return (
    <ScrollView
      vertical={true}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }>
      <Navbar />
      <View style={tw`flex p-[20px]`}>
        <View style={tw`bg-gray-100 rounded-lg`}>
          <View style={tw`p-[20px]`}>
            <Image
              style={tw`w-[120px] h-[120px] rounded-full mb-[25px] self-center`}
              source={{
                uri: `https://i.pravatar.cc/80?img=rio`,
              }}
            />
            <View style={tw`flex justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Nama
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {dataUser?.user?.data?.name}
              </Text>
            </View>
            <View style={tw`flex justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Email
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {dataUser?.user?.data?.email}
              </Text>
            </View>
            <View style={tw`flex justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Telepon
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {dataUser?.user?.data?.phone}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={tw`mt-4`}
            onPress={() => navigateEditProfile()}>
            <Text
              style={tw`text-center text-white self-center shadow bg-pink-500 w-[250px] rounded py-3`}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mt-4`}
            onPress={() => navigateOrderHistory()}>
            <Text
              style={tw`text-center text-white self-center shadow bg-pink-500 w-[250px] rounded py-3`}>
              Order History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`mt-5`} onPress={() => navigateLogout()}>
            <Text
              style={tw`text-center text-white self-center shadow bg-[#917FB3] w-[250px] rounded py-3`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
