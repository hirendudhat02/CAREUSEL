import {StyleSheet, TextInput, View} from 'react-native';
import React, {useRef} from 'react';
import {OTPInput, SignupContent} from '../components';
import {Text} from '../../../components';
import {colors} from '../../../theme';

const Terms = ({onVerificationCompleted}) => {
  const otpInput = useRef(null);

  const TermsData = [{title: 'Terms and Conditions'}];
  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue('1234');
  };

  const onNextPress = () => {
    // onVerificationCompleted();
  };

  return (
    <SignupContent onButtonPress={onNextPress} title={'Verification'}>
      <Text style={styles.info}>Terms and Conditions.</Text>
      {/* <OTPInput digits={4} />
      <Text style={styles.resend}>Resend Verification Code</Text> */}
    </SignupContent>
  );
};

export default Terms;

const styles = StyleSheet.create({
  info: {
    paddingBottom: 20,
  },
  resend: {
    paddingTop: 20,
    color: colors.secoundry,
  },
});
