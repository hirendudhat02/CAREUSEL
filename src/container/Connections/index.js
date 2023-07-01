import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Container} from '../../components';
import {colors, fonts} from '../../theme';
import InvitesScreen from './InvitesScreen';
import InvitedScreen from './InvitedScreen';
import RejectScreen from './RejectScreen';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import ActiveScreen from './ActiveScreen';
import {useDispatch} from 'react-redux';
import {moderateScale, verticalScale} from '../../helpers/ResponsiveFonts';
import {FilterAction} from '../../redux/Action/FilterAction';
import {ActionFilterAction} from '../../redux/Action/ActionFilter';
import {ReceivedFilterAction} from '../../redux/Action/ReceivedFilter';
import {RejectFilterAction} from '../../redux/Action/RejectFilter';
import {ConnectionBadgeResponse} from '../../redux/Action/ConnectionBadgeAction';
import FirebasePushnotifiation from '../../service/FirebasePushnotifiation';
const Tab = createMaterialTopTabNavigator();
const Connectionscreen = props => {
  const [client, setClient] = useState(false);
  const [expert, setExpert] = useState(false);
  const refRBSheet = useRef();
  const dispetch = useDispatch();
  const tabBarOptions = {
    activeTintColor: colors.secoundry,
    inactiveTintColor: colors.charcoal,
    indicatorStyle: {
      borderBottomColor: colors.secoundry,
      borderBottomWidth: 2,
    },
    pressOpacity: 1,
  };

  useEffect(() => {
    const _firebasePushnotifiation = new FirebasePushnotifiation();
    setTimeout(() => {
      _firebasePushnotifiation.initFirebaseService(props.navigation);
    }, 1000);
  }, []);

  useMemo(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setClient(false);
      setExpert(false);
      dispetch(ActionFilterAction(''));
      dispetch(FilterAction(''));
      dispetch(ReceivedFilterAction(''));
      dispetch(RejectFilterAction(''));
      dispetch(ConnectionBadgeResponse(null));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.navigation]);

  const onFilter = () => {
    refRBSheet.current.close();
    setTimeout(() => {
      dispetch(FilterAction(client === true ? 'client' : 'expert'));
      dispetch(ActionFilterAction(client === true ? 'client' : 'expert'));
      dispetch(ReceivedFilterAction(client === true ? 'client' : 'expert'));
      dispetch(RejectFilterAction(client === true ? 'client' : 'expert'));
    }, 500);
  };

  const onClearFilter = () => {
    refRBSheet.current.close();
    setTimeout(() => {
      dispetch(FilterAction(''));
      dispetch(ActionFilterAction(''));
      dispetch(ReceivedFilterAction(''));
      dispetch(RejectFilterAction(''));
      setClient(false);
      setExpert(false);
    }, 500);
  };

  return (
    <View style={{flexGrow: 1}}>
      <Container
        title={'Connections'}
        iconRight={'filtericon'}
        iconextra={'PlusUser'}
        onIconExtraPress={() => props.navigation.navigate('InviteScreen')}
        onIconRightPress={() => refRBSheet.current.open()}>
        <Tab.Navigator
          tabBarOptions={tabBarOptions}
          initialRouteName="Active"
          shouldRasterizeIOS
          screenOptions={{
            tabBarPressColor: colors.white,
            tabBarLabelStyle: {
              fontSize: moderateScale(14),
              fontFamily: fonts.Bold,
              textTransform: 'capitalize',
              fontWeight: '700',
            },
            tabBarStyle: {
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
          }}>
          <Tab.Screen component={ActiveScreen} name={'Active'} />
          <Tab.Screen component={InvitesScreen} name={'Received'} />
          <Tab.Screen component={InvitedScreen} name={'Sent'} />
          <Tab.Screen component={RejectScreen} name={'Inactive'} />
        </Tab.Navigator>
        <Bottomsheet
          sheettype="filter"
          refRBSheet={refRBSheet}
          client={client}
          expert={expert}
          clientonpress={() => {
            setClient(client === true ? false : true);
            setExpert(false);
          }}
          expertonpress={() => {
            setExpert(expert === true ? false : true);
            setClient(false);
          }}
          clearonpress={() => {
            onClearFilter();
          }}
          doneonpress={() => {
            onFilter();
          }}
        />
      </Container>
    </View>
  );
};

export default Connectionscreen;
