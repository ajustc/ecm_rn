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

  const user = useSelector(state => state.user);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();

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
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="email"
            placeholderTextColor="#000"
            keyboardType="password"
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
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileEdit;
