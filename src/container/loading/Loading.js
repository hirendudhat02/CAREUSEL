import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text, Watermark} from '../../components';
import {colors} from '../../theme';

const Loading = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={'large'} />
      <Text style={styles.pleaseWait}>Please wait...</Text>
      <Watermark />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pleaseWait: {
    paddingTop: 20,
  },
});
