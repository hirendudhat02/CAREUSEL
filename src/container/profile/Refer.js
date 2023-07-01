import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Container, Input, Text} from '../../components';
import AppModal from '../../components/Modal';
import Regex from '../../utils/helper';
import ErrorComponent from '../../components/Error';
import DropDownComponent from '../../components/DropDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loaderAction} from '../../redux/Action/LoaderAction';
import {ReferRequest, ReferResponse} from '../../redux/Action/ReferAction';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../helpers/loader';
import {moderateScale, verticalScale} from '../../helpers/ResponsiveFonts';

const professionsOptions = [
  'Chiropractor',
  'Health/Life Coach',
  'Massage Therapist',
  'Mental Health Professional',
  'Naturopathic Doctor',
  'Nutritionist',
  'Physical Therapist',
  'Primary Care Physician',
  'Personal Trainer',
  'Yoga Teacher',
];

const registeringAs = ['A Health & Wellness Professional', 'An Individual'];
const Refer = props => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [regiseterAs, setRegiseterAs] = useState('');
  // const [isSelected, setSelection] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState({
    firstname: false,
    lastname: false,
    email: false,
  });
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const referResponse = useSelector(state => state.refer);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          setUserID(UserData._id);
          setToken(tokenData);
        }
      });
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (referResponse.data !== null) {
      setSuccessModalOpen(true);
      dispetch(ReferResponse(null));
    }
  }, [referResponse]);

  const onSendPress = async () => {
    if (
      Regex.validateEmail(email) &&
      Regex.validateString(firstname) &&
      Regex.validateString(lastname)
    ) {
      const editErrorState = {...error};
      editErrorState.email = false;
      editErrorState.firstname = false;
      editErrorState.lastname = false;
      setError(editErrorState);
      Keyboard.dismiss();
      let payload = {
        userType: regiseterAs === 'An Individual' ? 'client' : 'expert',
        firstName: firstname,
        lastName: lastname,
        email: email.toLowerCase(),
        userId: userID,
        registeringAs: profession,
      };

      dispetch(loaderAction(true));
      dispetch(ReferRequest(payload, token, props.navigation));
    } else {
      const editErrorState = {...error};
      if (!Regex.validateEmail(email)) {
        editErrorState.email = true;
      } else {
        editErrorState.email = false;
      }
      if (!Regex.validateString(firstname)) {
        editErrorState.firstname = true;
      } else {
        editErrorState.firstname = false;
      }
      if (!Regex.validateString(lastname)) {
        editErrorState.lastname = true;
      } else {
        editErrorState.lastname = false;
      }

      setError(editErrorState);
    }
  };

  const CapitalizeFirstLetter = str => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };

  return (
    <View style={{flex: 1}}>
      <Container
        title={'Refer to Careusel'}
        iconLeft={'Back'}
        onIconLeftPress={() => props.navigation.goBack('')}>
        <KeyboardAvoidingView
          enabled={true}
          style={{flexGrow: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={verticalScale(60)}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <Input
                placeholder="Enter First name"
                label="First Name"
                value={firstname}
                onChangeText={txt => {
                  setFirstname(CapitalizeFirstLetter(txt));
                  error.firstname = null;
                }}
              />
              {error.firstname && (
                <ErrorComponent
                  right={'right'}
                  errorMessage={'Please enter valid first Name'}
                />
              )}
              <Input
                placeholder="Enter Last name"
                label="Last Name"
                value={lastname}
                onChangeText={txt => {
                  setLastname(CapitalizeFirstLetter(txt));
                  error.lastname = null;
                }}
              />
              {error.lastname && (
                <ErrorComponent
                  right={'right'}
                  errorMessage={'Please enter valid last name'}
                />
              )}
              <Input
                placeholder="Enter Email address"
                label="Email Address"
                keyboardType="email-address"
                value={email}
                autoCapitalize="none"
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

              <DropDownComponent
                label={'Registering As'}
                selected={regiseterAs}
                placeholder={'Select Registering as'}
                options={registeringAs}
                onSelect={text => {
                  setRegiseterAs(text);
                  setProfession('');
                }}
              />
              {regiseterAs === 'A Health & Wellness Professional' ? (
                <DropDownComponent
                  label={'Professions'}
                  selected={profession}
                  placeholder={'Select Professions'}
                  options={professionsOptions}
                  onSelect={text => setProfession(text)}
                />
              ) : null}

              {/* <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  boxType="square"
                  onValueChange={setSelection}
                  style={styles.checkbox}
                />
                <Text style={styles.label}>
                  Is the referred user an Expert?
                </Text>
              </View> */}
              <View style={styles.buttonview}>
                <Button
                  onPress={() => {
                    props.navigation.goBack('');
                  }}
                  isOutlined
                  label={'Cancel'}
                />

                <Button
                  disabled={
                    firstname !== '' &&
                    email !== '' &&
                    lastname !== '' &&
                    regiseterAs !== '' &&
                    (regiseterAs === 'A Health & Wellness Professional'
                      ? profession !== ''
                      : regiseterAs !== '')
                      ? false
                      : true
                  }
                  onPress={() => {
                    onSendPress();
                  }}
                  label={'Send'}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
      <AppModal
        modalStyle="success"
        isVisible={successModalOpen}
        details="Thanks for your referral! Invitation has been sent successfully."
        onBackdropPress={() => setSuccessModalOpen(false)}
        onBackButtonPress={() => setSuccessModalOpen(false)}
        onPressOk={() => {
          setSuccessModalOpen(false);
          setTimeout(() => {
            props.navigation.goBack('');
          }, 1000);
        }}
      />
      <Loader value={laderResponse.loader} />
    </View>
  );
};

export default Refer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 25,
  },
  checkbox: {
    alignSelf: 'center',
    height: 20,
    width: 20,
  },
  checkboxContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 8,
    fontSize: moderateScale(15),
  },
});
