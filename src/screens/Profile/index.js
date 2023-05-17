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

const Profile = props => {
  const {navigation} = props;
  const [refresh, setRefresh] = useState(false);
  const onRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, []);

  // Ambil info user yang sedang login
  const [id, setId] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [token, setToken] = useState('');

  // Ambil info riwayat belanja user by ID yang sdg login
  const [datariwayat, setDatariwayat] = useState([]);
  const [tgl, setTgl] = useState('');
  const [total, setTotal] = useState('');
  const [alamat, setAlamat] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // console.log(datariwayat);
  }, []);

  const redirectLogin = () => {
    Alert.alert('Warning', 'Please Login!');
    navigation.navigate('Login');
  };

  const getLoc = async () => {
    const a = await AsyncStorage.getAllItem();
    console.log('all ses :', a);
  };

  const deletelocStorage = () => {
    console.log('Succesfully logout!');
    AsyncStorage.clearAll();
    navigation.push('MyTabs');
  };

  const logout = () => {
    Alert.alert('Peringatan', 'Anda yakin logout?', [
      {
        text: 'Tidak',
        onPress: () => console.log('Tidak'),
      },
      {
        text: 'Ya',
        onPress: () => deletelocStorage(),
      },
    ]);
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
          <View style={tw`p-[20px]`}>
            <Image
              style={tw`w-[120px] h-[120px] rounded-full mb-[25px] self-center`}
              source={{uri: `https://i.pravatar.cc/80?img=${fullname}`}}
            />
            <View style={tw`flex-row justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Nama
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {fullname}
              </Text>
            </View>
            <View style={tw`flex-row justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Email
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {email}
              </Text>
            </View>
            <View style={tw`flex-row justify-center`}>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                Telepon
              </Text>
              <Text style={tw`text-[18px] font-light mb-[8px] text-black`}>
                {telepon}
              </Text>
            </View>
          </View>
        </View>
        <View>
          {datariwayat <= 0 ? (
            <Text style={tw`text-center self-center bg-pink-500 w-[250px] rounded py-3`}>No data history.</Text>
          ) : (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Tanggal</DataTable.Title>
                  <DataTable.Title style={{right: 33}}>Status</DataTable.Title>
                  <DataTable.Title style={{right: -30}}>Total</DataTable.Title>
                  <DataTable.Title style={{right: 0}}>Opsi</DataTable.Title>
                </DataTable.Header>

                {datariwayat.map(riwayat => {
                  return (
                    <Riwayat
                      key={riwayat.id_pembelian}
                      idpembelian={riwayat.id_pembelian}
                      tanggal={riwayat.tanggal_pembelian}
                      status={riwayat.status_pembelian}
                      total={riwayat.total_pembelian}
                    />
                  );
                })}

                <DataTable.Pagination
                  page={1}
                  numberOfPages={3}
                  onPageChange={page => {
                    console.log(page);
                  }}
                  label="1-2 of 6"
                />
              </DataTable>
            </ScrollView>
          )}
        </View>
        {/* <View>
          <TouchableOpacity onPress={getLoc}>
            <Text style={tw`text-center self-center bg-pink-500 w-[250px]`}>
              GetSess
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={logout}>
            <Text style={tw`text-center self-center bg-pink-500 w-[250px]`}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};

const Riwayat = ({idpembelian, tanggal, status, total}) => {
  const navigation = useNavigation();
  return (
    <DataTable.Row>
      <DataTable.Cell style={{width: 90}}>{tanggal ?? '-'}</DataTable.Cell>
      <DataTable.Cell style={{width: 170}}>{status ?? '-'}</DataTable.Cell>
      <DataTable.Cell style={{width: 70}}>{total ?? '-'}</DataTable.Cell>
      <DataTable.Cell>
        <View style={tw`flex-col`}>
          <TouchableOpacity
            onPress={() =>
              navigation.push('Nota', {
                idpembelian: idpembelian,
              })
            }>
            <Text
              style={tw`bg-[#5bc0de] w-[100px] text-white text-center py-[7px] border-2 my-[10px]`}>
              Nota
            </Text>
          </TouchableOpacity>
          {status === 'Pending' ? (
            <TouchableOpacity
              onPress={() =>
                navigation.push('Input Pembayaran', {
                  idpembelian: idpembelian,
                  tanggal: tanggal,
                  total: total,
                })
              }>
              <Text
                style={tw`bg-[#5cb85c] w-[100px] text-white text-center py-[7px] border-2 my-[10px]`}>
                Input
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.push('Lihat Pembayaran', {
                  idpembelian: idpembelian,
                })
              }>
              <Text
                style={tw`bg-[#f0ad4e] w-[100px] text-white text-center py-[7px] border-2 my-[10px]`}>
                Lihat
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  );
};

export default Profile;
