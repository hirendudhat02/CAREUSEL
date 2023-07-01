import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Container, Input} from '../../components';
import ErrorComponent from '../../components/Error';
import AppModal from '../../components/Modal';
import Loader from '../../helpers/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../redux/Action/ChangePasswordAction';
import {loaderAction} from '../../redux/Action/LoaderAction';
import Regex from '../../utils/helper';
import {LogOutRequest} from '../../redux/Action/LogOutAction';
import {verticalScale} from '../../helpers/ResponsiveFonts';
const Changepassword = props => {
  const [isoldPasswordHide, setOldPasswordHide] = useState(true);
  const [isPasswordHide, setPasswordHide] = useState(true);
  const [isConfirmPasswordHide, setConfirmPasswordHide] = useState(true);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userID, setUserID] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [token, setToken] = useState('');
  const dispetch = useDispatch();
  const [error, setError] = useState({
    password: null,
    NewPassword: null,
    confirmNewPassword: null,
  });
  const laderResponse = useSelector(state => state.loader);
  const changeNewpassword = useSelector(state => state.changepassword);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('userdata').then(Data => {
        let UserData = JSON.parse(Data);
        setUserID(UserData._id);
        setToken(UserData.accessToken[0]);
      });
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (changeNewpassword.data !== null) {
      setSuccessModalOpen(true);
      setNewPassword('');
      setPassword('');
      setConfirmNewPassword('');
      dispetch(ChangePasswordResponse(null));
    }
  }, [changeNewpassword]);

  const onPasswordToggleSecureText = () => {
    setPasswordHide(c => !c);
  };
  const onOldPasswordToggleSecureText = () => {
    setOldPasswordHide(c => !c);
  };

  const onConfirmToggleSecureText = () => {
    setConfirmPasswordHide(c => !c);
  };

  const saveOnpress = () => {
    let isValid = true;
    const editErrorState = {...error};

    if (password.length > 0 && password.length < 8) {
      isValid = false;
      editErrorState.password = 'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(password)) {
      isValid = false;
      editErrorState.password =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else {
      editErrorState.password = null;
    }

    if (newPassword.length > 0 && newPassword.length < 8) {
      isValid = false;
      editErrorState.NewPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(newPassword)) {
      isValid = false;
      editErrorState.NewPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else if (password === newPassword) {
      isValid = false;
      editErrorState.NewPassword =
        'Current password and new password should not be same';
    } else {
      editErrorState.NewPassword = null;
    }

    if (confirmNewPassword.length > 0 && confirmNewPassword.length < 8) {
      isValid = false;
      editErrorState.confirmNewPassword =
        'The password must be between 8-16 characters';
    } else if (!Regex.validatePassword(confirmNewPassword)) {
      isValid = false;
      editErrorState.confirmNewPassword =
        'Password must be at least one uppercase, one lowercase, one special character and one number.';
    } else if (newPassword !== confirmNewPassword) {
      isValid = false;
      editErrorState.confirmNewPassword =
        'New password and confirm password should be same';
    } else {
      editErrorState.confirmNewPassword = null;
    }

    setError(editErrorState);

    if (isValid) {
      Keyboard.dismiss();
      let payload = {
        userId: userID,
        password: password,
        newPassword: newPassword,
      };
      dispetch(loaderAction(true));
      dispetch(ChangePasswordRequest(payload, token, props.navigation));
    }
  };

  const onlogout = () => {
    let payload = {
      userId: userID,
    };
    dispetch(loaderAction(true));
    dispetch(LogOutRequest(payload, token, props.navigation));
  };

  return (
    <View style={{flex: 1}}>
      <Container
        title={'Change Password'}
        iconLeft={'Back'}
        onIconLeftPress={() => props.navigation.goBack('')}>
        <Loader value={laderResponse.loader} />
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
                placeholder="Enter Current password"
                label="Current Password"
                isPassword={true}
                secureTextEntry={isoldPasswordHide}
                icon={isoldPasswordHide ? 'HideEye' : 'Eye'}
                onIconPress={onOldPasswordToggleSecureText}
                value={password}
                maxLength={16}
                onChangeText={txt => {
                  setPassword(txt);
                  error.password = null;
                }}
              />
              {error.password !== null ? (
                <ErrorComponent right={'right'} errorMessage={error.password} />
              ) : null}
              <Input
                placeholder="Enter New password"
                label="New Password"
                isPassword={true}
                secureTextEntry={isPasswordHide}
                icon={isPasswordHide ? 'HideEye' : 'Eye'}
                onIconPress={onPasswordToggleSecureText}
                value={newPassword}
                maxLength={16}
                onChangeText={txt => {
                  setNewPassword(txt);
                  error.NewPassword = null;
                }}
              />
              {error.NewPassword !== null ? (
                <ErrorComponent
                  right={'right'}
                  errorMessage={error.NewPassword}
                />
              ) : null}
              <Input
                placeholder="Enter Confirm password"
                label="Confirm New Password"
                isPassword={true}
                maxLength={16}
                secureTextEntry={isConfirmPasswordHide}
                icon={isConfirmPasswordHide ? 'HideEye' : 'Eye'}
                onIconPress={onConfirmToggleSecureText}
                value={confirmNewPassword}
                onChangeText={txt => {
                  setConfirmNewPassword(txt);
                  error.confirmNewPassword = null;
                }}
              />
              {error.confirmNewPassword !== null ? (
                <ErrorComponent
                  right={'right'}
                  errorMessage={error.confirmNewPassword}
                />
              ) : null}
              <View style={styles.buttonview}>
                <Button
                  onPress={() => {
                    props.navigation.goBack('');
                  }}
                  isOutlined
                  label={'Cancel'}
                />

                <Button
                  onPress={() => {
                    saveOnpress();
                  }}
                  disabled={
                    newPassword !== '' &&
                    password !== '' &&
                    confirmNewPassword !== ''
                      ? false
                      : true
                  }
                  label={'Save'}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
      <AppModal
        modalStyle="success"
        isVisible={successModalOpen}
        details="Your password has been changed successfully"
        onBackdropPress={() => {
          setSuccessModalOpen(false);
          setTimeout(() => {
            onlogout();
          }, 1000);
        }}
        onBackButtonPress={() => {
          setSuccessModalOpen(false);
          setTimeout(() => {
            onlogout();
          }, 1000);
        }}
        onPressOk={() => {
          setSuccessModalOpen(false);
          setTimeout(() => {
            onlogout();
          }, 1000);
        }}
      />
    </View>
  );
};

export default Changepassword;
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
    paddingVertical: 30,
  },
});
