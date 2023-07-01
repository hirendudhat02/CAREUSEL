import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {OTPInput, SignupContent} from '../components';
import {Text} from '../../../components';
import {colors, fonts} from '../../../theme';
import {useState} from 'react';
import {Button} from '../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {
  VerificationRequest,
  VerificationResponse,
} from '../../../redux/Action/VerificationAction';
import {loaderAction} from '../../../redux/Action/LoaderAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BasicInfoRequest,
  BasicInfoResponse,
} from '../../../redux/Action/BasucInfoAction';
import WebView from 'react-native-webview';
import {moderateScale} from '../../../helpers/ResponsiveFonts';
import _BackgroundTimer from 'react-native-background-timer';
import {useNavigation} from '@react-navigation/native';
import Constant from '../../../helpers/Constant';
const Verification = ({onVerificationCompleted, onLoader}) => {
  const [show, setShow] = useState(1);
  const [userId, setuserId] = useState('');
  const [load, setLoad] = useState(false);
  const [userData, setuserData] = useState({});
  const [otp, setOTP] = useState([]);
  const hoursMinSecs = {minutes: 0, seconds: 120};
  const {minutes = 0, seconds = 60} = hoursMinSecs;
  const [[mins, secs], setTime] = useState([minutes, seconds]);
  const scrolltop = useRef();
  const dispetch = useDispatch();
  const navigation = useNavigation();
  const verification = useSelector(state => state.verification);
  const laderResponse = useSelector(state => state.loader);
  const basicInfoResponse = useSelector(state => state.basicinfo);
  useEffect(() => {
    if (laderResponse !== undefined) {
      onLoader(laderResponse.loader);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laderResponse]);

  useEffect(() => {
    if (basicInfoResponse.data !== null) {
      let apiData = basicInfoResponse.data.data.user;
      setuserId(apiData._id);
      AsyncStorage.setItem('SignUp', apiData._id);
      dispetch(BasicInfoResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfoResponse]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('SignUp').then(id => {
        if (id !== null) {
          setuserId(id);
        }
      });
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    AsyncStorage.getItem('SignUp').then(id => {
      if (id !== null) {
        setuserId(id);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('SignUpData').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        setuserData(UserData);
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
    try {
      let payload = userData;
      dispetch(loaderAction(true));
      dispetch(BasicInfoRequest(payload));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (verification !== undefined) {
      if (verification.data !== null) {
        let apiData = verification.data;
        if (apiData.message === 'Email verified successfully') {
          setShow(2);
          dispetch(VerificationResponse(null));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verification]);

  const onVerification = () => {
    let payload = {
      otp: otp.join(''),
      id: userId,
      signupType: 'directSignup',
    };
    dispetch(loaderAction(true));
    dispetch(VerificationRequest(payload));
  };
  const onNextPress = () => {
    onVerificationCompleted();
  };

  return (
    <SignupContent
      onButtonPress={() => onVerification()}
      disabled={otp.join('').length === 4 ? false : true}
      title={show === 1 ? 'Verification' : null}
      scrolltop={scrolltop}
      visible={show === 1 ? true : false}>
      <View style={{paddingBottom: 20, flex: 1}}>
        {show === 1 ? (
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
            <ScrollView bounces={false}>
              <WebView
                nestedScrollEnabled
                source={{
                  uri: Constant.PrivetURL,
                }}
                style={styles.webViewstyle}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                originWhitelist={['*']}
                scalesPageToFit
                onLoadStart={() => setLoad(true)}
                onLoad={() => setLoad(false)}
                startInLoadingState={true}
                mixedContentMode="always"
                automaticallyAdjustContentInsets={false}
              />
              <View style={styles.buttonview}>
                <Button
                  disabled={load}
                  onPress={() => {
                    onNextPress();
                  }}
                  label={'I Accept'}
                />
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </SignupContent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  webViewstyle: {
    height: Dimensions.get('screen').height / 1.5,
    backgroundColor: 'transparent',
    marginHorizontal: -25,
    marginTop: -40,
  },
  info: {
    paddingBottom: 20,
  },
  resend: {
    paddingTop: 20,
    color: colors.secoundry,
  },
  title: {
    fontFamily: fonts.Bold,
    fontSize: moderateScale(25),
    top: -15,
    color: colors.charcoal,
  },
  semititle: {
    fontFamily: fonts.SemiBold,
    fontSize: moderateScale(19),
    paddingVertical: 5,
    color: colors.charcoal,
  },
  detailstxt: {
    fontFamily: fonts.Normal,
    fontSize: moderateScale(15),
    marginTop: 5,
    color: colors.charcoal,
  },
  buttonview: {
    flexGrow: 1,
    marginVertical: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
