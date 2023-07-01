import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Container } from '../../components';
import { colors, fonts } from '../../theme';
import ExpertScreen from './ExpertScreen';
import ClientScreen from './ClientScreen';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import { ExpertRefreshAction } from '../../redux/Action/ExpertRefreshAction';
import { ClientRefreshAction } from '../../redux/Action/ClientRefresh';
import { useDispatch } from 'react-redux';
import FirebasePushnotifiation from '../../service/FirebasePushnotifiation';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { ReceivedFilterAction } from '../../redux/Action/ReceivedFilter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConnectionBadgeRequest } from '../../redux/Action/ConnectionBadgeAction';
const Tab = createMaterialTopTabNavigator();
const Deshbordscreen = props => {
  const [initialRouteName, setInitialRouteName] = useState('ExpertScreen');
  const dispetch = useDispatch();
  const useFocuse = useIsFocused();
  const tabBarOptions = {
    activeTintColor: colors.secoundry,
    inactiveTintColor: colors.charcoal,
    indicatorStyle: {
      flex: 1,
      borderBottomColor: colors.secoundry,
      borderBottomWidth: 2,
    },
    pressOpacity: 1,
  };

  useEffect(() => {
    setInitialRouteName('ExpertScreen');
  }, [useFocuse]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      dispetch(ExpertRefreshAction('expert'));
      setTimeout(() => {
        dispetch(ClientRefreshAction('client'));
      }, 500);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.navigation]);

  useEffect(() => {
    //Working
    messaging().onMessage(firebaseMsg => {
      dispetch(ReceivedFilterAction(''));
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          let payload = {
            currentUserId: UserData._id,
            action: 'invites',
          };
          dispetch(
            ConnectionBadgeRequest(payload, tokenData, props.navigation),
          );
        }
      });
    });
    const _firebasePushnotifiation = new FirebasePushnotifiation();
    setTimeout(() => {
      _firebasePushnotifiation.initFirebaseService(props.navigation);
    }, 1000);
  }, []);

  return (
    <View style={{ flexGrow: 1 }}>
      <Container
        title={'My Circle'}
        iconRight={'PlusUser'}
        onIconRightPress={() => props.navigation.navigate('InviteScreen')}>
        <Tab.Navigator
          tabBarOptions={tabBarOptions}
          initialRouteName={initialRouteName}
          shouldRasterizeIOS={false}
          screenOptions={{
            tabBarPressColor: colors.white,
            tabBarScrollEnabled: false,
            lazy: true,
            tabBarLabelStyle: {
              fontSize: moderateScale(14),
              fontFamily: fonts.Bold,
              textTransform: 'capitalize',
              fontWeight: '700',
            },
            tabBarStyle: styles.tabBarContainer,
          }}>
          <Tab.Screen
            key={'ExpertScreen'}
            name={'ExpertScreen'}
            component={ExpertScreen}
            options={{ tabBarLabel: 'Expert Circle' }}
          />
          <Tab.Screen
            key={'ClientScreen'}
            name={'ClientScreen'}
            component={ClientScreen}
            options={{ tabBarLabel: 'Friends Circle' }}
          />
        </Tab.Navigator>
      </Container>
    </View>
  );
};

export default Deshbordscreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  tabBarContainer: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 4.5,
    elevation: 10,
    backgroundColor: colors.white,
  },
});
