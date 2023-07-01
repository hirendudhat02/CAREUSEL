import {StyleSheet, Text as RNText, View} from 'react-native';
import React, {useMemo} from 'react';
import {colors, fonts} from '../../theme';
import {moderateScale} from '../../helpers/ResponsiveFonts';

const Text = ({children, style, isBold, isSemiBold, numberOfLines}) => {
  const textStyle = useMemo(() => {
    const textStyle = [styles.normal];
    if (isBold) {
      textStyle.push(styles.bold);
    }
    if (isSemiBold) {
      textStyle.push(styles.semiBold);
    }

    if (style) {
      textStyle.push(style);
    }

    return textStyle;
  }, [isBold, isSemiBold, style]);

  return (
    <RNText style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

export default Text;

const styles = StyleSheet.create({
  normal: {
    fontSize: moderateScale(14),
    fontFamily: fonts.Normal,
    color: colors.charcoal,
    letterSpacing: 0,
  },
  bold: {
    fontFamily: fonts.Bold,
  },
  semiBold: {
    fontFamily: fonts.SemiBold,
  },
});
