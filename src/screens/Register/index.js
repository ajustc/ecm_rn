/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

import {login} from './../../actions/auth';
import axios from 'axios';
import {API_URL} from '../../services/constants';

const Register = ({navigation}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();

  const onRegister = () => {
    let dataUser = {
      name,
      email,
      password,
      phone,
      address,
    };

    axios
      .post(`${API_URL}api/auth/register`, dataUser)
      .then(success => {
        const response = success.data;
        console.log({response});

        navigation.replace('LoginScreen');
      })
      .catch(error => {
        console.log({onRegister: error});
      });
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-200`}>
      <Text style={tw`text-black text-[20px]`}>
        Please Register to your account
      </Text>

      <TextInput
        style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
        value={name}
        onChangeText={text => setName(text)}
        placeholderTextColor="#000"
        placeholder="name"
        keyboardType="default"
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
        secureTextEntry={true}
        placeholderTextColor="#000"
        placeholder="password"
        keyboardType="default"
      />
      <TextInput
        style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
        value={phone}
        onChangeText={text => setPhone(text)}
        placeholderTextColor="#000"
        placeholder="phone number"
        keyboardType="number-pad"
      />
      <TextInput
        style={tw`w-[360px] text-[16px] border-[1px] border-gray-500 my-3 text-black rounded`}
        value={address}
        onChangeText={text => setAddress(text)}
        placeholderTextColor="#000"
        placeholder="address"
        keyboardType="default"
        numberOfLines={3}
      />

      <View style={tw`flex flex-col`}>
        <TouchableOpacity
          style={tw`mb-5 mt-3`}
          onPress={() => navigation.replace('HomeScreen')}>
          <Text style={tw`text-black text-[16px]`}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>

        <Button onPress={() => onRegister()} title="Register" />
      </View>
    </View>
  );
};

export default Register;
