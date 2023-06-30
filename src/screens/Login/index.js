/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

import {login} from './../../actions/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const onLogin = () => {
    let dataUser = {
      email,
      password,
    };

    dispatch(login(dataUser))
      .then(response => {
        if (response.status === 'success') {
          console.log({onLogin: response});
          navigation.replace('HomeScreen');
        }
      })
      .catch(error => {
        console.log({onLogin: error});
      });
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-200`}>
      <Text style={tw`text-black text-[20px]`}>
        Please Login to your account
      </Text>
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

      <View style={tw`flex flex-col`}>
        <TouchableOpacity style={tw`mb-5 mt-3`} onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={tw`text-black text-[16px]`}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
        
        <Button onPress={() => onLogin()} title="Login" />
      </View>
    </View>
  );
};

export default Login;
