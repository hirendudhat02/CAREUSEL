import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {Button, Text} from '../../../components';
import {colors} from '../../../theme';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from '../../../helpers/ResponsiveFonts';
const SignupContent = ({
  children,
  buttonTitle = 'Next',
  title,
  onButtonPress,
  visible,
  disabled,
  scrolltop,
  loadervalue,
}) => {
  const navigation = useNavigation();

  const onLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View
      style={{
        flexGrow: 1,
        paddingBottom: 35,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 130}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          ref={scrolltop}
          bounces={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title} isBold={true}>
            {title}
          </Text>
          <View style={{paddingHorizontal: 10}}>{children}</View>
          {visible && (
            <View style={styles.bottomContainer}>
              <Button
                onPress={onButtonPress}
                label={buttonTitle}
                disabled={disabled}
              />
              <View style={styles.bottomLoginContainer}>
                <Text style={styles.loginNote}>Already a member? </Text>
                <Pressable
                  style={styles.loginNowContainer}
                  onPress={onLoginPress}>
                  <Text style={styles.loginNow}>Login</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupContent;

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  loginNote: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginVertical: 15,
    color: colors.charcoal,
  },
  loginNow: {
    fontSize: moderateScale(16),
    color: colors.secoundry,
  },
  title: {
    fontSize: moderateScale(22),
    marginVertical: 20,
    paddingLeft: 10,
  },
  loginNowContainer: {},
  bottomLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 60 : 20,
  },
});
