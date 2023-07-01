import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {Button, Text, Watermark} from '../../../components';
import Image from 'react-native-scalable-image';
import {images} from '../../../assets';
import {colors} from '../../../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loader from '../../../helpers/loader';
import {moderateScale, verticalScale} from '../../../helpers/ResponsiveFonts';

const SigninContent = ({
  children,
  onButtonPress,
  title,
  buttonTitle,
  note,
  notePressable,
  onNotePress,
  disabled,
  loadervalue,
}) => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <Loader value={loadervalue} />
      <KeyboardAvoidingView
        enabled={true}
        style={{flexGrow: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : verticalScale(60)}>
        <Watermark />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
          <View style={styles.logoContainer}>
            <Image source={images.Logo} width={width * 0.7} />
          </View>
          <View style={styles.subContainer}>
            <View>
              <Text isBold={true} style={styles.login}>
                {title}
              </Text>
              {children}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={onButtonPress}
              label={buttonTitle}
              disabled={disabled}
            />
          </View>
          <View style={styles.bottomLoginContainer}>
            <Text style={styles.loginNote}>{`${note} `}</Text>
            <Pressable style={styles.loginNowContainer} onPress={onNotePress}>
              <Text style={styles.loginNow}>{notePressable}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SigninContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 50,
  },
  subContainer: {
    // flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  signUpNote: {
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  signUpNow: {
    fontSize: moderateScale(16),
    color: colors.secoundry,
  },
  login: {
    fontSize: 24,
    paddingBottom: 25,
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
  },
  loginNowContainer: {},
  bottomLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
