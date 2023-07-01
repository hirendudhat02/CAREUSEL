import React from 'react';
import {StyleSheet} from 'react-native';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import {colors} from '../../theme';
import Text from '../text/Text';

const ErrorComponent = props => {
  const {errorMessage, right, top} = props;
  const topSpace = top ? top : 5;
  return (
    <Text style={[styles.errorText, {textAlign: 'left', paddingTop: topSpace}]}>
      {errorMessage}
    </Text>
  );
};

export default ErrorComponent;

const styles = StyleSheet.create({
  errorText: {
    color: colors.red,
    fontSize: moderateScale(14),
    fontWeight: '400',
    letterSpacing: 0.03,
    lineHeight: 17,
  },
});
