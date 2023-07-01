import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {OTPInput, SigninContent} from '../components';
import {useNavigation} from '@react-navigation/native';
import {Input, Text} from '../../../components';
import ErrorComponent from '../../../components/Error';
import Regex from '../../../utils/helper';
import {colors} from '../../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  EmailVerificationRequest,
  EmailVerificationResponse,
} from '../../../redux/Action/EmailVerificationAction';
import {
  ForgotOtpRequest,
  ForgotOtpResponse,
} from '../../../redux/Action/ForgotOtpAction';
import {loaderAction} from '../../../redux/Action/LoaderAction';
import {ForgotPasswordRequest} from '../../../redux/Action/ForgotPasswordAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _BackgroundTimer from 'react-native-background-timer';
const SetPassword = ({onSetPasswordPress}) => {
  const navigation = useNavigation();
  const [isPasswordHide, setPasswordHide] = useState(true);
  const [isConfirmPasswordHide, setConfirmPasswordHide] = useState(true);
  const [Password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [otpVarification, setOtpVarification] = useState(true);
  const [otp, setOTP] = useState([]);
  const [VarificationData, setVarificationData] = useState({});
  const hoursMinSecs = {minutes: 0, seconds: 120};
  const {minutes = 0, seconds = 60} = hoursMinSecs;
  const [[mins, secs], setTime] = useState([minutes, seconds]);
  const [error, setError] = useState({
    Password: null,
    ConfirmPassword: null,
  });
  const dispetch = useDispatch();
  const emailResponse = useSelector(state => state.emailverification);
  const forgototpResponse = useSelector(state => state.forgototp);
  const laderResponse = useSelector(state => state.loader);
  useEffect(() => {
    if (emailResponse.data !== null) {
      setVarificationData(emailResponse.data.data);
      dispetch(EmailVerificationResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailResponse]);

  useEffect(() => {
    AsyncStorage.getItem('Forgot').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        setEmail(UserData?.email);
      }
    });
  }, []);

  useEffect(() => {
    const timerId = _BackgroundTimer.setInterval(() => tick(), 1000);
    return () => _BackgroundTimer.clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mins, secs]);

  const tick = () => {
    if (secs !== 0) {
      setTime([mins, secs - 1]);
    }
  };
  const resend_otp = () => {
    setTime([minutes, seconds]);
    Keyboard.dismiss();
    try {
      let payload = {
        email: email,
      };
      let resend = 'resend';
      dispetch(loaderAction(true));
      dispetch(EmailVerificationRequest(payload, resend));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (forgototpResponse.data !== null) {
      if (forgototpResponse.data === true) {
        setOtpVarification(false);
        dispetch(ForgotOtpResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgototpResponse]);

  const onPasswordToggleSecureText = () => {
    setPasswordHide(c => !c);
  };

  const onConfirmToggleSecureText = () => {
    setConfirmPasswordHide(c => !c);
  };

  const onLoginPress = () => {
    navigation.pop();
  };

  const onButtonPress = () => {
    Keyboard.dismiss();
    if (otpVarification === false) {
      onSetPassword();
    } else {
      let payload = {
        otp: otp.join(''),
        token: VarificationData.token,
        tokenType: 'forgetPassword',
      };
      dispetch(loaderAction(true));
      dispetch(ForgotOtpRequest(payload));
    }
  };
  const onSetPassword = async () => {
    let isValid = true;
    const editErrorState = {...error};

    if (Password.length > 0 && Password.length < 8) {
      isValid = false;
      editErrorState.Password = 'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(Password)) {
      isValid = false;
      editErrorState.Password =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else {
      editErrorState.Password = null;
    }

    if (ConfirmPassword.length > 0 && ConfirmPassword.length < 8) {
      isValid = false;
      editErrorState.ConfirmPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(ConfirmPassword)) {
      isValid = false;
      editErrorState.ConfirmPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else if (Password !== ConfirmPassword) {
      isValid = false;
      editErrorState.ConfirmPassword =
        'New password and confirm password should be same';
    } else {
      editErrorState.ConfirmPassword = null;
    }

    setError(editErrorState);

    if (isValid) {
      let payload = {
        password: Password,
        token: VarificationData.token,
        tokenType: 'forgetPassword',
      };
      dispetch(loaderAction(true));
      dispetch(ForgotPasswordRequest(payload, navigation));
    }
  };

  return (
    <SigninContent
      title={
        otpVarification === false ? 'Set Your New Password' : 'Verification'
      }
      buttonTitle={otpVarification === false ? 'Set Password' : 'Verify'}
      note="Already a member?"
      notePressable="Login"
      loadervalue={laderResponse.loader}
      disabled={
        otpVarification === false
          ? Password !== '' && ConfirmPassword !== ''
            ? false
            : true
          : otp.join('').length === 4
          ? false
          : true
      }
      onButtonPress={() => onButtonPress()}
      onNotePress={onLoginPress}>
      {otpVarification === true ? (
        <>
          <Text style={styles.info}>
            Please enter the verification code sent to your email address.
          </Text>
          <OTPInput digits={4} setOTP={setOTP} otp={otp} />
          <TouchableOpacity
            disabled={secs === 0 ? false : true}
            onPress={() => resend_otp()}
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            {secs !== 0 ? (
              <Text style={styles.resend}>
                You can request for OTP again after{' '}
                {secs.toString().padStart(2, '0') + ' seconds'}
              </Text>
            ) : (
              <Text style={styles.resend}>{'Resend Verification Code'}</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Input
            placeholder="Enter Password"
            label="New Password"
            isPassword={true}
            secureTextEntry={isPasswordHide}
            icon={isPasswordHide ? 'HideEye' : 'Eye'}
            onIconPress={onPasswordToggleSecureText}
            value={Password}
            maxLength={16}
            onChangeText={txt => {
              setPassword(txt);
              error.Password = null;
            }}
          />
          {error.Password !== null ? (
            <ErrorComponent right={'right'} errorMessage={error.Password} />
          ) : null}
          <Input
            placeholder="Enter Confirm Password"
            label="Confirm New Password"
            isPassword={true}
            secureTextEntry={isConfirmPasswordHide}
            icon={isConfirmPasswordHide ? 'HideEye' : 'Eye'}
            onIconPress={onConfirmToggleSecureText}
            value={ConfirmPassword}
            maxLength={16}
            onChangeText={txt => {
              setConfirmPassword(txt);
              error.ConfirmPassword = null;
            }}
          />
          {error.ConfirmPassword !== null ? (
            <ErrorComponent
              right={'right'}
              errorMessage={error.ConfirmPassword}
            />
          ) : null}
        </>
      )}
    </SigninContent>
  );
};

export default SetPassword;

const styles = StyleSheet.create({
  info: {
    paddingBottom: 20,
  },
  resend: {
    paddingTop: 20,
    color: colors.secoundry,
  },
});
