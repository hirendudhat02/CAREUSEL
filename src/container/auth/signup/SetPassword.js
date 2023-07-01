import React, { useEffect, useState } from 'react';
import { SignupContent } from '../components';
import { Input } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import Regex from '../../../utils/helper';
import ErrorComponent from '../../../components/Error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loaderAction } from '../../../redux/Action/LoaderAction';
import { useDispatch, useSelector } from 'react-redux';
import {
  PasswordRequest,
  PasswordResponse,
} from '../../../redux/Action/PasswordAction';
import DeviceInfo from 'react-native-device-info';
import Toast from '../../../utils/toast';
const SetPassword = ({ onLoader }) => {
  const [isPasswordHide, setPasswordHide] = useState(true);
  const [isConfirmPasswordHide, setConfirmPasswordHide] = useState(true);
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [deviceID, setDeviceID] = useState('');
  const navigation = useNavigation();

  const [error, setError] = useState({
    Password: null,
    ConfirmPassword: null,
  });
  const [userId, setuserId] = useState('');
  const dispetch = useDispatch();

  const laderResponse = useSelector(state => state.loader);
  const passwordResponse = useSelector(state => state.password);

  useEffect(() => {
    if (laderResponse !== undefined) {
      onLoader(laderResponse.loader);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laderResponse]);

  useEffect(() => {
    if (passwordResponse.data !== null && passwordResponse.data !== undefined) {
      Toast.show(
        'Congratulations, Your Account has been created successfully',
        'success',
      );
      AsyncStorage.setItem('userdata', JSON.stringify(passwordResponse?.data?.data));
      AsyncStorage.removeItem('SignUpData');
      dispetch(loaderAction(false));
      setTimeout(() => {
        navigation.replace('OnBoarding');
      }, 2000);
      dispetch(PasswordResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordResponse]);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setDeviceID(uniqueId);
    });
    AsyncStorage.getItem('SignUp').then(id => {
      if (id !== null) {
        setuserId(id);
      }
    });
  }, []);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      DeviceInfo.getUniqueId().then(uniqueId => {
        setDeviceID(uniqueId);
      });
      AsyncStorage.getItem('SignUp').then(id => {
        if (id !== null) {
          setuserId(id);
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  const onPasswordToggleSecureText = () => {
    setPasswordHide(c => !c);
  };

  const onConfirmToggleSecureText = () => {
    setConfirmPasswordHide(c => !c);
  };
  const onLoginPress = async () => {
    let isValid = true;
    const editErrorState = { ...error };

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
        userId: userId,
        password: Password,
        token: '',
        deviceId: deviceID,
      };

      dispetch(loaderAction(true));
      dispetch(PasswordRequest(payload, navigation));
    }
  };

  return (
    <SignupContent
      title={'Create Your Password'}
      buttonTitle="Setup Account"
      visible={true}
      disabled={Password !== '' && ConfirmPassword !== '' ? false : true}
      onButtonPress={() => onLoginPress()}>
      <Input
        placeholder="Enter Password"
        label="Choose a Password"
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
        label="Confirm Password"
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
        <ErrorComponent right={'right'} errorMessage={error.ConfirmPassword} />
      ) : null}
    </SignupContent>
  );
};

export default SetPassword;
