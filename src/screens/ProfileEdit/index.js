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
  TextInput,
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
import {useSelector} from 'react-redux';

const ProfileEdit = props => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, []);

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      setDataUser(currentUser);

      setName(currentUser.user.data.name);
      setEmail(currentUser.user.data.email);
      setPassword(currentUser.user.data.password);
      setPhone(currentUser.user.data.phone);
      setAddress(currentUser.user.data.address);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log({dataUser: dataUser.user.data});
  console.log({name});

  const [name, setName] = useState(dataUser?.user?.data?.name);
  const [email, setEmail] = useState(dataUser?.user?.data?.email);
  const [password, setPassword] = useState(dataUser?.user?.data?.password);
  const [phone, setPhone] = useState(dataUser?.user?.data?.phone);
  const [address, setAddress] = useState(dataUser?.user?.data?.address);

  const handleEditProfile = () => {
    if (!name || !email || !password || !phone || !address) {
      Alert.alert('Please fill all fields');
      return false;
    }

    axios
      .post(
        `${API_URL}api/auth/editprofile/${dataUser?.user?.data?.uid}`,
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `${dataUser.access_token}`,
          },
        },
      )
      .then(success => {
        console.log(success);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <ScrollView
      vertical={true}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }>
      <Navbar />
      <View style={tw`flex p-[20px]`}>
        <View style={tw`bg-gray-100 rounded-lg`}>
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={name}
            onChangeText={text => setName(text)}
            placeholder="name"
            placeholderTextColor="#000"
            keyboardType="text"
          />
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="email"
            placeholderTextColor="#000"
            keyboardType="email-address"
          />
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={phone}
            onChangeText={text => setPhone(text)}
            placeholder="phone"
            placeholderTextColor="#000"
            keyboardType="number"
          />
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={address}
            onChangeText={text => setAddress(text)}
            placeholder="address"
            placeholderTextColor="#000"
            keyboardType="text"
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity onPress={() => handleEditProfile()}>
            <Text
              style={tw`text-center text-white self-center shadow bg-[#917FB3] w-[250px] rounded py-3`}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileEdit;
