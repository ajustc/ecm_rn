/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

// services
import {API_URL} from './../../services/constants';

// components
import Navbar from './../../components/Navbar';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

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
      setPhone(currentUser.user.data.phone);
      setAddress(currentUser.user.data.address);

      console.log({getUser: currentUser});
    } catch (error) {
      console.log({getUser: error});
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [updatedProfile, setUpdatedProfile] = useState(0);

  const [name, setName] = useState(dataUser?.user?.data?.name);
  const [email, setEmail] = useState(dataUser?.user?.data?.email);
  const [phone, setPhone] = useState(dataUser?.user?.data?.phone);
  const [address, setAddress] = useState(dataUser?.user?.data?.address);

  const handleEditProfile = () => {
    if (!name || !email || !phone || !address) {
      Alert.alert('Please fill all fields');
      return false;
    }

    axios
      .post(
        `${API_URL}api/auth/editprofile/${dataUser?.user?.data?.uid}`,
        {
          name,
          email,
          password: null,
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
        const response = success.data
        console.log({handleEditProfile: response});
        setUpdatedProfile(1);
      })
      .catch(error => {
        setUpdatedProfile(2);
        console.log({handleEditProfile: error});
      });
  };

  return (
    <ScrollView
      vertical={true}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }>
      <Navbar />
      <View style={tw`flex p-[16px]`}>
        <View style={tw`bg-gray-100 rounded-lg`}>
          <Text>Name</Text>
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={name}
            onChangeText={text => setName(text)}
            placeholder="name"
            placeholderTextColor="#000"
            keyboardType="default"
          />
          <Text>
            Email
            {` `}
            <Text style={tw`text-xs text-red-500`}>*must unique</Text>
          </Text>
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="email"
            placeholderTextColor="#000"
            keyboardType="email-address"
          />
          <Text>Phone</Text>
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={phone}
            onChangeText={text => setPhone(text)}
            placeholder="phone"
            placeholderTextColor="#000"
            keyboardType="number-pad"
          />
          <Text>Address</Text>
          <TextInput
            style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
            value={address}
            onChangeText={text => setAddress(text)}
            placeholder="address"
            placeholderTextColor="#000"
            keyboardType="default"
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />

          {updatedProfile === 1 ? (
            <Text style={tw`text-center text-green-500`}>
              Profile success updated
            </Text>
          ) : updatedProfile === 2 ? (
            <Text style={tw`text-center text-red-500`}>
              Profile failed updated
            </Text>
          ) : null}

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
