import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {images} from '../assets';
import FastImage from 'react-native-fast-image';
const SplashScreenAnimation = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigationFunction();
    }, 3000);
  }, []);

  const navigationFunction = () => {
    AsyncStorage.getItem('userdata').then(tokendata => {
      if (tokendata !== null) {
        navigation.replace('HomeStack');
      } else {
        navigation.replace('LoginStack');
      }
    });
  };
  return (
    <View style={styles.animatedContainer}>
      <FastImage
        source={images.splashscreen}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        resizeMode={'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
});

export default SplashScreenAnimation;
