import {StyleSheet, Text, TextInput, View, Platform} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {colors, fonts} from '../../../theme';
import {moderateScale, verticalScale} from '../../../helpers/ResponsiveFonts';
const OTPInput = ({digits, setOTP, otp}) => {
  const textInputRef = useRef([]);
  // const [otp, setOTP] = useState([]);
  const [focusedBox, setFocusedBox] = useState();

  const focusPrevious = (key, index) => {
    if (key === 'Backspace' && index !== 0) {
      textInputRef.current[index - 1].focus();
    }
  };

  const focusNext = (index, value) => {
    const inputLength = textInputRef.current.length;
    if (index < inputLength - 1 && value) {
      textInputRef.current[index + 1].focus();
    }
    if (index === inputLength - 1) {
      textInputRef.current[index].blur();
    }
    setOTP(otp => {
      otp[index] = value;
      return [...otp];
    });
  };

  const textInput = useMemo(() => {
    const inputs = Array(digits).fill(0);
    return inputs.map((_, index) => {
      return (
        <View style={styles.inputContainer(index === focusedBox)} key={index}>
          <TextInput
            ref={ref => (textInputRef.current[index] = ref)}
            keyboardType="numeric"
            value={otp[index]}
            style={styles.textInput}
            onChangeText={v => {
              focusNext(index, v);
            }}
            maxLength={1}
            onFocus={() => {
              setFocusedBox(index);
            }}
            onBlur={() => {
              if (index === focusedBox) {
                setFocusedBox(null);
              }
            }}
            onKeyPress={e => focusPrevious(e.nativeEvent.key, index)}
          />
        </View>
      );
    });
  }, [digits, otp, focusedBox]);

  return <View style={styles.container}>{textInput}</View>;
};

export default OTPInput;

const styles = StyleSheet.create({
  inputContainer: isSelected => ({
    borderWidth: 1,
    borderColor: isSelected ? colors.secoundry : colors.grayLight,
    borderRadius: 5,
    width: 70,
    paddingVertical: Platform.OS === 'ios' ? 10 : 2,
    alignItems: 'center',
  }),
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    fontSize: moderateScale(18),
    fontFamily: fonts.Normal,
    width: 70,
    textAlign: 'center',
  },
});
