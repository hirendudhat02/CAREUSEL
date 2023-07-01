import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Linking, PermissionsAndroid, Platform, Pressable, StyleSheet } from 'react-native';
import { Input, Text } from '../../../components';
import { colors } from '../../../theme';
import Regex from '../../../utils/helper';
import { SigninContent } from '../components';
import { useNavigation } from '@react-navigation/native';
import ErrorComponent from '../../../components/Error';
import { useDispatch, useSelector } from 'react-redux';
import { LoginRequest, LoginResponse } from '../../../redux/Action/LoginAction';
import { loaderAction } from '../../../redux/Action/LoaderAction';
import DeviceInfo from 'react-native-device-info';
import { moderateScale } from '../../../helpers/ResponsiveFonts';
import { FcmTokenRequest } from '../../../redux/Action/FcmTokenAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestUserPermission } from '../../../service/NotificationService';
import messaging from '@react-native-firebase/messaging';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COMETCHAT_CONSTANTS } from '../../../CONSTS';
import Toast from '../../../utils/toast';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();
  const [deviceID, setDeviceID] = useState('');
  const [error, setError] = useState({
    email: null,
    password: null,
  });
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const loginResponse = useSelector(state => state.login);

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      DeviceInfo.getUniqueId().then(uniqueId => {
        setDeviceID(uniqueId);
      });
      // createNewUser();
      setEmail('');
      setPassword('');
      AsyncStorage.removeItem('SignUpData');
      const editErrorState = { ...error };
      editErrorState.email = null;
      editErrorState.password = null;
      setError(editErrorState);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (loginResponse?.data !== null && loginResponse?.data !== undefined) {
      dispetch(loaderAction(true));
      if (loginResponse.data.devices.length >= 3) {
        Alert.alert(
          'Already login to multiples devices',
          'Do you want to logout all devices?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                // dispetch(LoginResponse(null));
              },
            },
            {
              text: 'OK',
              onPress: () => {
                auth(
                  loginResponse?.data._id,
                  loginResponse
                );
                fcmTokenApi(loginResponse);
                Toast.show('You are successfully logged in', 'success');
                AsyncStorage.setItem('userdata', JSON.stringify(loginResponse.data));
                setTimeout(() => {
                  navigation.replace('HomeStack');
                }, 2000);
                dispetch(loaderAction(false));
              },
            },
          ],
          { cancelable: false },
        );
        dispetch(loaderAction(false));
      } else {
        auth(
          loginResponse?.data._id,
          loginResponse
        );
        fcmTokenApi(loginResponse);
        Toast.show('You are successfully logged in', 'success');
        AsyncStorage.setItem('userdata', JSON.stringify(loginResponse.data));
        setTimeout(() => {
          navigation.replace('HomeStack');
        }, 2000);
        dispetch(loaderAction(false));
      }
      dispetch(LoginResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginResponse]);

  const fcmTokenApi = async loginData => {
    let checkToken = await AsyncStorage.getItem('fcmToken');
    let payload = {
      id: loginData.data._id,
      fcmDeviceToken: checkToken,
      deviceType: Platform.OS,
    };
    dispetch(loaderAction(true));
    dispetch(FcmTokenRequest(payload, loginData.data.accessToken[0]));
  };
  var appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .build();

  const auth = async (uid, loginResponse) => {
    dispetch(loaderAction(true));
    let checkToken = await AsyncStorage.getItem('fcmToken');
    try {
      await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting)
        .then(() => {
          if (CometChat.setSource) {
            CometChat.setSource('ui-kit', Platform.OS, 'react-native');
          }
          CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY)
            .then(user => {
              if (user) {
                // Toast.show('You are successfully logged in', 'success');
                // AsyncStorage.setItem('userdata', JSON.stringify(loginResponse.data));
                CometChat.registerTokenForPushNotification(checkToken);
                dispetch(loaderAction(false));
                // setTimeout(() => {
                //   navigation.replace('HomeStack');
                // }, 2000);
              }
              dispetch(loaderAction(false));
            })
            .catch(error => {
              // Alert.alert(error?.code)
              dispetch(loaderAction(false));
            });
        })
        .catch(() => {
          dispetch(loaderAction(false));
        })
    } catch (error) {
      dispetch(loaderAction(false));
    }

  };

  const onLoginPress = async () => {
    let isValid = true;
    const editErrorState = { ...error };
    if (!Regex.validateEmail(email)) {
      isValid = false;
      editErrorState.email = 'Please enter valid email address';
    } else {
      editErrorState.email = null;
    }

    if (password.length > 0 && password.length < 8) {
      isValid = false;
      editErrorState.password = 'Please enter valid password';
    } else if (!Regex.validatePassword(password)) {
      isValid = false;
      editErrorState.password =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else {
      editErrorState.password = null;
    }

    setError(editErrorState);
    if (isValid) {
      // auth();
      // navigation.replace('HomeStack');
      Keyboard.dismiss();
      if (Platform.OS === 'ios') {
        PushNotificationIOS.requestPermissions([
          'alert',
          'badge',
          'sound',
          'critical',
        ]);
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        messaging.NotificationAndroidPriority.PRIORITY_HIGH;
        messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC;
        if (enabled) {
          requestUserPermission();
          let payload = {
            email: email.toLowerCase(),
            password: password,
            deviceId: deviceID,
          };
          dispetch(loaderAction(true));
          dispetch(LoginRequest(payload, navigation));
        } else {
          requestUserPermission();
          let payload = {
            email: email.toLowerCase(),
            password: password,
            deviceId: deviceID,
          };
          dispetch(loaderAction(true));
          dispetch(LoginRequest(payload, navigation));
        }
      } else {
        const granted = await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS',
          {
            title: 'Need permission for notification',
            message:
              'To get updates via. push notifications we need your permission for notifications.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          requestUserPermission();
          let payload = {
            email: email.toLowerCase(),
            password: password,
            deviceId: deviceID,
          };
          dispetch(loaderAction(true));
          dispetch(LoginRequest(payload, navigation));
        } else {
          Alert.alert(
            'Oops!!',
            'Permission not granted for Notifications. Please go to settings and allow the permission to start receiving notifications.',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Do not show again',
                onPress: () => {
                  requestUserPermission();
                  let payload = {
                    email: email.toLowerCase(),
                    password: password,
                    deviceId: deviceID,
                  };
                  dispetch(loaderAction(true));
                  dispetch(LoginRequest(payload, navigation));
                }
              },
              {
                text: 'Cancel',
                style: 'destructive',
              },
            ],
          );
        }
      }
    }
  };

  const onToggleSecureText = () => {
    setSecureTextEntry(c => !c);
  };

  const onForgotPassword = () => {
    navigation.push('ResetPassword');
  };

  const onSignupPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SigninContent
      disabled={password !== '' && email !== '' ? false : true}
      title={'Login to Your Account'}
      buttonTitle="Login"
      note="Don’t have an account?"
      notePressable="Sign Up Now"
      loadervalue={laderResponse.loader}
      onButtonPress={() => {
        onLoginPress();
      }}
      onNotePress={onSignupPress}>
      <Input
        placeholder="Enter Email Address"
        label="Email Address"
        maxLength={60}
        keyboardType="email-address"
        value={email}
        autoCapitalize="none"
        onChangeText={txt => {
          setEmail(txt);
          error.email = null;
        }}
      />
      {error.email !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.email} />
      ) : null}
      <Input
        label="Password"
        placeholder="Enter Password"
        onIconPress={onToggleSecureText}
        secureTextEntry={isSecureTextEntry}
        isPassword={true}
        value={password}
        maxLength={16}
        onChangeText={txt => {
          setPassword(txt);
          error.password = null;
        }}
        icon={isSecureTextEntry ? 'HideEye' : 'Eye'}
      />
      {error.password !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.password} />
      ) : null}
      <Pressable
        onPress={onForgotPassword}
        style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </Pressable>
    </SigninContent>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  subContainer: {
    // flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  login: {
    fontSize: moderateScale(24),
    paddingBottom: 25,
  },
  forgotPassword: {
    color: colors.secoundry,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  buttonContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  waterMarkContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  signUpNote: {
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  signUpNow: {
    fontSize: moderateScale(16),
    color: colors.secoundry,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 50,
  },
});
