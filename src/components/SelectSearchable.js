import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
// import SearchableDropdown from 'react-native-searchable-dropdown';
// import SearchableDropdown from "searchable-dropdown-react-native";
import tw from 'twrnc';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

const SelectSearchable = ({items, callback, prefix, placeholder}) => {
  const [dataSelected, setDataSelected] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);

  return (
    <View>
      <Text style={tw`text-black font-semibold ml-2`}>{placeholder}</Text>
      <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        initialValue={items[0]} // or just '2'
        showClear={false}
        onSelectItem={(item) => {
          if (item) {
            setDataSelected(item)
            if (prefix === "2") {
              callback(item)
            } else {
              callback(item.id)
            }
          }
        }}
        dataSet={items}
        textInputProps={{
          placeholder: placeholder,
          autoCorrect: false,
          autoCapitalize: 'none',
          style: {
            borderRadius: 25,
            backgroundColor: 'transparent',
            color: '#000',
            paddingLeft: 18,
          },
        }}
      />
    </View>
  );
};

export default SelectSearchable;
