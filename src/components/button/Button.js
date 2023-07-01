import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Text from '../text/Text';
import {colors} from '../../theme';

const Button = ({
  label,
  onPress,
  disabled,
  isLoading,
  isOutlined,
  lableStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={styles.container(isOutlined, isLoading, disabled)}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.label}
          size={'large'}
          color={colors.secoundry}
        />
      ) : (
        <Text
          isBold={true}
          style={[styles.label(isOutlined, disabled), lableStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: (isOutlined, isLoading, disabled) => ({
    backgroundColor:
      disabled === true
        ? colors.gray
        : isOutlined || isLoading
        ? colors.white
        : colors.secoundry,
    borderRadius: 7,
    borderWidth: isLoading ? 0 : 2,
    borderColor: disabled === true ? colors.gray : colors.secoundry,
  }),
  label: (isOutlined, disabled) => ({
    color:
      disabled === true
        ? colors.grayMedium
        : isOutlined
        ? colors.secoundry
        : colors.white,
    fontSize: 22,
    paddingHorizontal: 35,
    paddingTop: 7,
    paddingBottom: 9,
    textAlign: 'center',
  }),
});
