import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../theme';
import Text from '../text/Text';
import MaskInput from 'react-native-mask-input';
import {images} from '../../assets';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
const Input = ({
  label,
  icon,
  onIconPress,
  style,
  textInputtype,
  addonPress,
  inputStyle,
  onPressInput,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label ? (
        <Text isBold={true} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={styles.inputContainer}>
        {inputStyle === 'Birthday' ? (
          <TouchableOpacity
            style={{width: '100%'}}
            onPress={onPressInput}
            activeOpacity={0.5}>
            <View pointerEvents="none">
              <TextInput
                style={styles.birthdayinput}
                {...props}
                placeholderTextColor={colors.grayLight}
              />
            </View>
          </TouchableOpacity>
        ) : inputStyle === 'MaskInput' ? (
          <>
            {props.value !== '' ? (
              <>
                <Text
                  style={{
                    fontSize: moderateScale(18),
                    fontWeight: '500',
                  }}>
                  +1
                </Text>
              </>
            ) : null}
            <MaskInput
              style={[styles.input, style]}
              {...props}
              placeholderTextColor={colors.grayLight}
              mask={[
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
          </>
        ) : (
          <TextInput
            style={[styles.input, style]}
            {...props}
            placeholderTextColor={colors.grayLight}
          />
        )}

        {icon ? (
          <TouchableOpacity
            style={styles.righticonstyle}
            onPress={onIconPress}
            disabled={icon === 'searchwhite' ? true : false}
            activeOpacity={0.5}>
            <FastImage
              source={images[icon]}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
        {textInputtype ? (
          <TouchableOpacity onPress={addonPress}>
            <Text isBold={true} style={styles.add}>
              Add
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  input: {
    fontFamily: fonts.Normal,
    fontSize: moderateScale(17),
    flex: 1,
    justifyContent: 'center',
  },
  birthdayinput: {
    fontFamily: fonts.Normal,
    fontSize: moderateScale(17),
    flex: 1,
    color: colors.charcoal,
    justifyContent: 'center',
  },
  label: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 7,
    borderColor: colors.grayLight,
    borderWidth: 2,
    paddingVertical: Platform.OS === 'ios' ? 9 : 1,
    alignItems: 'center',
  },
  add: {
    fontFamily: fonts.Normal,
    fontSize: moderateScale(17),
    justifyContent: 'center',
    color: colors.secoundry,
  },
  righticonstyle: {
    padding: 5,
  },
});
