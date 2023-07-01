import {StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from '../icon/Icon';
import Text from '../text/Text';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../theme';
const IconInfo = ({
  icon,
  label,
  labelstyle,
  iconsize,
  disabled,
  iconstyle,
  onPress,
  vectorIcon,
}) => {
  return (
    <View style={styles.container}>
      {vectorIcon ? (
        <FontAwesome name={icon} size={25} color={colors.secoundry} />
      ) : (
        <Icon
          height={iconsize !== undefined ? iconsize : 15}
          size={iconsize !== undefined ? iconsize : 15}
          name={icon}
          disabled={disabled}
          onPress={onPress}
          style={iconstyle}
        />
      )}

      <Text numberOfLines={2} style={[styles.label, labelstyle]}>
        {label}
      </Text>
    </View>
  );
};

export default IconInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  label: {
    paddingStart: 10,
    paddingBottom: 3,
    fontSize: moderateScale(13),
  },
});
