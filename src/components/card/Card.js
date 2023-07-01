import {StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import Text from '../text/Text';
import {moderateScale} from '../../helpers/ResponsiveFonts';

const Card = ({label, info}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text isSemiBold={true} style={styles.label}>
          {label}
        </Text>
        <Text>{info}</Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: colors.white,
    shadowColor: colors.charcoal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    borderRadius: 7,
  },
  label: {
    paddingBottom: 8,
    fontSize: moderateScale(18),
  },
});
