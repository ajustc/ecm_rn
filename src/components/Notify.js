import React from 'react';
import {View, Button} from 'react-native';

import Toast from 'react-native-toast-message';

const Notify = () => {
  Toast.show;
  const showToast = () => {
    console.log({Toast});
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋',
    });
  };

  return (
    <View>
      <Button title="Show toast" onPress={showToast} />
      {Toast.show({
        type: 'success',
        text1: 'Hello',
        text2: 'This is some something 👋',
      })}
    </View>
  );
};

export default Notify;
