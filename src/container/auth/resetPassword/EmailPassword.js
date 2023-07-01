import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SigninContent} from '../components';
import {useNavigation} from '@react-navigation/native';
import {Input} from '../../../components';
import Regex from '../../../utils/helper';
import ErrorComponent from '../../../components/Error';
import {useDispatch, useSelector} from 'react-redux';
import {EmailVerificationRequest} from '../../../redux/Action/EmailVerificationAction';
import {loaderAction} from '../../../redux/Action/LoaderAction';

const EmailPassword = ({onCheckMailPress}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState({
    email: false,
  });
  const onLoginPress = () => {
    navigation.pop();
  };
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const emailResponse = useSelector(state => state.emailverification);

  useEffect(() => {
    if (emailResponse.data !== null) {
      onCheckMailPress();
    }
  }, [emailResponse]);

  const onResetPasswordPress = () => {
    if (Regex.validateEmail(email)) {
      const editErrorState = {...error};
      editErrorState.email = false;
      editErrorState.password = false;
      setError(editErrorState);
      Keyboard.dismiss();
      let payload = {
        email: email.toLowerCase(),
      };
      dispetch(loaderAction(true));
      dispetch(EmailVerificationRequest(payload));
    } else {
      const editErrorState = {...error};
      if (!Regex.validateEmail(email)) {
        editErrorState.email = true;
      } else {
        editErrorState.email = false;
      }
      setError(editErrorState);
    }
  };

  return (
    <SigninContent
      title={'Reset Password'}
      buttonTitle="Reset Password"
      note="Already a member?"
      loadervalue={laderResponse.loader}
      notePressable="Login"
      onButtonPress={() => onResetPasswordPress()}
      disabled={email !== '' ? false : true}
      onNotePress={onLoginPress}>
      <Input
        placeholder="Enter Email Address"
        label="Email Address"
        maxLength={60}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={txt => {
          setEmail(txt);
          error.email = null;
        }}
      />
      {error.email && (
        <ErrorComponent
          right={'right'}
          errorMessage={'Please enter valid email address'}
        />
      )}
    </SigninContent>
  );
};

export default EmailPassword;

const styles = StyleSheet.create({});
