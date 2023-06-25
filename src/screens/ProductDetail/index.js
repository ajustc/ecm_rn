import {
  Alert,
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {API_URL} from '../../services/constants';
import tw from 'twrnc';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {__addToCart} from '../../actions/cart';
import {useNavigation} from '@react-navigation/native';
import {SliderBox} from 'react-native-image-slider-box';

const ProductDetailScreen = props => {
  const {
    product_name,
    product_slug,
    product_picture,
    product_price,
    product_weight,
    product_discount,
  } = props.route.params;

  function discount(valuePrice, valueDiscount) {
    var total = (valuePrice * valueDiscount) / 100;
    var fix = valuePrice - total;
    return fix;
  }

  const arrayProduct = product_picture.split(', ') ?? [];

  const [dataProductImage, setDataProductImage] = useState(arrayProduct);

  useEffect(() => {
    const dataImg = [];

    dataProductImage.forEach(element => {
      const newUrlImage = `${API_URL}storage/product/${element}`;
      dataImg.push(newUrlImage);
    });

    setDataProductImage(dataImg);
  }, []);

  const navigation = useNavigation();

  const [sspId, setSspId] = useState();
  const [sspSize, setSspSize] = useState();
  const [size, setSize] = useState();

  const [qty, setQty] = useState('1');
  const [productSizeStock, setProductSizeStock] = useState();

  const GetProductBySlug = () => {
    axios
      .get(`${API_URL}api/auth/product/showbyslug?product_slug=${product_slug}`)
      .then(success => {
        const response = success.data;

        setProductSizeStock(response.sizestock);
        console.log({product: response.product});
        console.log({productSizeStock});
      })
      .catch(error => {
        console.log({error});
      });
  };

  useEffect(() => {
    GetProductBySlug();
  }, []);

  const handleQty = valueQty => {
    const [_, __, maxQty] = size.split(' | ') ?? [];

    if (valueQty === Number(maxQty)) return;
    if (valueQty === 0) return;

    const value = valueQty.toString();
    setQty(value);
  };

  const dispatch = useDispatch();

  const addToCart = item => {
    if (!item.product_id) Alert.alert('Choose size first');

    dispatch(__addToCart(item, qty))
      .then(response => {
        if (response.status === 'success') {
          // setCartItems([...cartItems, item]);
          navigation.replace('HomeScreen');
        }
      })
      .catch(error => {
        console.log({product: error});
      });
  };

  return (
    <View>
      <View>
        <SliderBox sliderBoxHeight={420} images={dataProductImage} />
      </View>

      <View style={tw`bg-white p-2 rounded shadow-lg relative`}>
        <View>
          <Text>Price</Text>

          <View style={tw`flex flex-row`}>
            <Text style={tw`text-lg text-red-500`}>
              Rp. {discount(product_price, product_discount)}
            </Text>
            <Text style={tw`ml-2 text-lg line-through`}>Rp. {product_price}</Text>
          </View>
        </View>

        <View>
          <Text>Size</Text>

          <Picker
            selectedValue={size}
            onValueChange={(itemValue, itemIndex) => {
              const [ssp_id, ssp_size, ___] = itemValue.split(' | ') ?? [];
              setSspId(ssp_id);
              setSspSize(ssp_size);
              setSize(itemValue);
            }}>
            {productSizeStock &&
              productSizeStock.map((item, index) => {
                const value =
                  item.ssp_id + ' | ' + item.ssp_size + ' | ' + item.ssp_stock;
                return (
                  <Picker.Item
                    key={item.ssp_size}
                    label={item.ssp_size + ' | ' + item.ssp_stock}
                    value={value}
                  />
                );
              })}
          </Picker>
        </View>

        <View>
          <Text>Jumlah</Text>
          <View style={tw`flex flex-row items-center`}>
            <TouchableOpacity onPress={() => handleQty(Number(qty) - 1)}>
              <Text
                style={tw`w-12 h-12 rounded bg-gray-300 font-bold text-xl text-center pt-2`}>
                -
              </Text>
            </TouchableOpacity>
            <TextInput
              value={qty}
              style={tw`p-2 mx-3 text-center rounded text-[16px] text-black border-[1px] border-gray-500 my-3 text-black`}
            />
            <TouchableOpacity onPress={() => handleQty(Number(qty) + 1)}>
              <Text
                style={tw`w-12 h-12 rounded bg-gray-300 font-bold text-xl text-center pt-2`}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            addToCart({
              product_id: sspId,
              product_name,
              product_picture,
              product_price,
              product_weight,
              product_discount,
              product_size: sspSize,
              qty: qty,
            });
          }}>
          <Text
            style={tw`text-[16px] text-black p-2 rounded text-center bg-[#917FB3]`}>
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
