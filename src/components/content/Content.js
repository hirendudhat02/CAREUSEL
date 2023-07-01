import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import Text from '../text/Text';
import Watermark from '../watermark/Watermark';

const Content = ({children, isLoading, isFailed}) => {
  return (
    <View style={styles.container}>
      <Watermark />
      {isLoading ? (
        <View style={styles.subContainer}>
          <ActivityIndicator color={colors.secoundry} size="large" />
        </View>
      ) : isFailed ? (
        <View style={styles.subContainer}>
          <Text isBold={true}>Something went wrong</Text>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
