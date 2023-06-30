import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import SelectSearchable from '../../components/SelectSearchable';
import axios from 'axios';
import {API_URL} from '../../services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/Navbar';
import tw from 'twrnc';

import {useNavigation} from '@react-navigation/native';

const Checkout = props => {
  const navigation = useNavigation();

  const {key, name, params} = props.route;

  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);

  // const dataUser = user;

  const [dataUser, setDataUser] = useState({
    isLoggedIn: false,
  });

  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const currentUser = JSON.parse(savedUser);

      setDataUser(currentUser);
      console.log({getUser: currentUser});
    } catch (error) {
      console.log({getUser: error});
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [cartState, setCartState] = useState([]);

  const getCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      const currentCart = JSON.parse(savedCart);

      if (!currentCart) {
        setCartState();
      } else {
        setCartState(currentCart);
      }
      console.log({getCart: currentCart});
    } catch (error) {
      console.log({getCart: error});
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataCosts, setDataCosts] = useState([]);

  const [dataCheckoutProvince, setDataCheckoutProvince] = useState('');
  const [dataCheckoutCity, setDataCheckoutCity] = useState(0);
  const [dataCheckoutType, setDataCheckoutType] = useState('');
  const [dataCheckoutPostalCode, setDataCheckoutPostalCode] = useState('');

  const [dataCheckoutExpedition, setDataCheckoutExpedition] = useState('');
  const [dataCheckoutEstimate, setDataCheckoutEstimate] = useState('');
  const [dataCheckoutPackage, setDataCheckoutPackage] = useState('');
  const [dataCheckoutShippingCosts, setDataCheckoutShippingCosts] =
    useState('');

  const pyd = {
    productCart: cartState,
    request: params.request,
    user_id: dataUser?.user?.data?.uid,
    name: dataUser?.user?.data?.name,
    email: dataUser?.user?.data?.email,
  };

  const storageProvince = provinceId => {
    setDataCheckoutProvince(provinceId);

    GetCity(provinceId);
  };

  const GetProvince = async () => {
    await axios
      .get(`${API_URL}api/rajaongkir/getprovince`)
      .then(success => {
        const response = success?.data ?? [];
        console.log({GetProvince: response});

        var data = [];
        response.map(item => {
          data.push({
            id: Number(item.province_id),
            title: item.province,
          });
        });

        if (data.length > 0) {
          setDataProvince(data);
        }
      })
      .catch(error => {
        console.log({GetProvince: error});
      });
  };

  useEffect(() => {
    GetProvince();
  }, []);

  const storageCity = data => {
    setDataCheckoutCity(data.id);
    setDataCheckoutType(data.item.type);
    setDataCheckoutPostalCode(data.item.postal_code);

    setDataExpedition([
      {
        id: '1',
        title: 'POS',
      },
      {
        id: '2',
        title: 'TIKI',
      },
      {
        id: '3',
        title: 'JNE',
      },
    ]);
  };

  const GetCity = async provinceId => {
    await axios
      .get(`${API_URL}api/rajaongkir/getcity?id_province=${provinceId}`)
      .then(success => {
        const response = success?.data?.rajaongkir?.results ?? [];
        console.log({GetCity: response});

        var data = [];
        response.map(item => {
          data.push({
            id: Number(item.city_id),
            title: item.city_name,
            item,
          });
        });

        if (data.length > 0) {
          setDataCity(data);
        }
      })
      .catch(error => {
        console.log({GetCity: error});
      });
  };

  const storageExpedition = data => {
    console.log({data});
    var dataCourier;
    switch (data) {
      case '1':
        dataCourier = 'pos';
        break;
      case '2':
        dataCourier = 'tiki';
        break;
      case '3':
        dataCourier = 'jne';
        break;

      default:
        alert('fail courrier');
        break;
    }
    setDataCheckoutExpedition(dataCourier);

    const payloads = {
      origin: 153,
      destination: dataCheckoutCity,
      weight: params.request.total_weight ?? params.totalWeight,
      courier: dataCourier,
    };

    GetCost(payloads);
  };

  const storageCost = data => {
    var [pkg, shippingCosts, estimate] = data.split(' - ');
    setDataCheckoutEstimate(estimate);
    setDataCheckoutPackage(pkg);
    setDataCheckoutShippingCosts(shippingCosts);
  };

  const GetCost = async payloads => {
    if (
      payloads.destination !== 0 &&
      payloads.origin !== '' &&
      payloads.weight !== ''
    ) {
      await axios
        .get(`${API_URL}api/rajaongkir/getcost`, {params: payloads})
        .then(success => {
          var response = success?.data?.rajaongkir?.results[0]?.costs ?? [];
          console.log({GetCost: response});

          var data = [];
          for (let index = 0; index < response.length; index++) {
            const element = response[index];

            const pckg = element.service;
            const shippingCosts = element.cost[0].value;
            const estimate = element.cost[0].etd;

            const text = pckg + ' - ' + shippingCosts + ' - ' + estimate;

            data.push({
              id: text,
              title: text,
            });
          }

          setDataCosts(data);

        })
        .catch(error => {
          console.log({GetCost: error});
        });
    }
  };

  const [dataExpedition, setDataExpedition] = useState([]);

  function discount(valuePrice, valueDiscount) {
    var total = (valuePrice * valueDiscount) / 100;
    var fix = valuePrice - total;
    return fix;
  }

  const DoPay = async () => {
    pyd.request.province = dataCheckoutProvince;
    pyd.request.district = dataCheckoutCity;
    pyd.request.type = dataCheckoutType;
    pyd.request.postal_code = dataCheckoutPostalCode;

    pyd.request.expedition = dataCheckoutExpedition;
    pyd.request.estimation = dataCheckoutEstimate;
    pyd.request.package = dataCheckoutPackage;
    pyd.request.shipping_costs = dataCheckoutShippingCosts;

    const totalOrder =
      Number(pyd.request.totalOrder) + Number(dataCheckoutShippingCosts);
    const disc = discount(totalOrder, Number(pyd.request.couponvalue));

    pyd.request.totalOrder = disc;
    pyd.request.couponvalue = disc;

    await axios
      .post(`${API_URL}api/auth/checkout`, pyd, {
        headers: {
          Authorization: `${dataUser.access_token}`,
        },
      })
      .then(success => {
        const response = success.data;
        const redirectUrl = response.snaptoken.redirect_url;

        console.log({DoPay: response});

        navigation.push('WebviewScreen', {
          redirect: redirectUrl,
          order_id: 0,
          token: dataUser.access_token
        });
      })
      .catch(error => {
        console.log({DoPay: error});
      });
  };

  return (
    <View>
      <Navbar btnCart={false} btnLogout={false} />

      <SelectSearchable
        items={dataProvince}
        callback={storageProvince}
        prefix="1"
        placeholder={dataProvince.length > 0 ? 'Choose Province' : 'No Data'}
      />
      <SelectSearchable
        items={dataCity}
        callback={storageCity}
        prefix="2"
        placeholder={dataCity.length > 0 ? 'Choose City' : 'No Data'}
      />
      <SelectSearchable
        items={dataExpedition}
        callback={storageExpedition}
        prefix="3"
        placeholder={
          dataExpedition.length > 0 ? 'Choose Expedition' : 'No Data'
        }
      />
      <SelectSearchable
        items={dataCosts}
        callback={storageCost}
        prefix="4"
        placeholder={dataCosts.length > 0 ? 'Choose Package' : 'No Data'}
      />

      {/* CHECKOUT */}
      <View style={tw`flex flex-row justify-center items-center`}>
        <TouchableOpacity onPress={() => DoPay()}>
          <Text
            style={tw`text-black font-semibold p-5 text-white shadow w-[140px] text-center bg-pink-400`}>
            Pay Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;
