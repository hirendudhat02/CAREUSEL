import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Login,
  SignUp,
  ResetPassword,
  OnBoarding,
  PushNotification,
  Profile,
} from '../../container';
import BottomTabNavigator from '../tabs/tabNavigator';
import InviteScreen from '../../container/dashboard/InviteScreen';
import clientProfile from '../../container/dashboard/clientProfile';
import GroupInfo from '../../container/conversations/GroupInfo';
import editProfile from '../../container/profile/EditProfile';
import refer from '../../container/profile/Refer';
import SplashScreenAnimation from '../../container/SplashAnimation';
import { NavigationContainer } from '@react-navigation/native';
import Changepassword from '../../container/profile/ChangePassword';
import { CometChatMessages } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src';

const Stack = createNativeStackNavigator();

const UnAuth = ({ navigation }) => {
  const HomeStack = () => {
    return (
      <Stack.Navigator
        initialRouteName={'BottomTabNavigator'}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
        <Stack.Screen name="CometChatMessages" component={CometChatMessages} />
        <Stack.Screen name="InviteScreen" component={InviteScreen} />
        <Stack.Screen name="clientProfile" component={clientProfile} />
        <Stack.Screen name="GroupInfo" component={GroupInfo} />
        <Stack.Screen name="changepassword" component={Changepassword} />
        <Stack.Screen name="editProfile" component={editProfile} />
        <Stack.Screen name="refer" component={refer} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    );
  };

  const LoginStack = () => {
    return (
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="PushNotification" component={PushNotification} />
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SplashScreenAnimation}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={'SplashScreenAnimation'}
          component={SplashScreenAnimation}
        />
        <Stack.Screen name={'LoginStack'} component={LoginStack} />
        <Stack.Screen name={'HomeStack'} component={HomeStack} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; export default UnAuth;