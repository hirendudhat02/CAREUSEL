import React, { useEffect, useRef, useState } from 'react';
import { View, Platform, StyleSheet, Alert } from 'react-native';
import colors from '../../theme/colors';
import { Profile } from '../../container';
import { images } from '../../../src/assets/index';
import Connectionscreen from '../../container/Connections';
import Deshbordscreen from '../../container/dashboard';
import { fonts } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectionBadgeRequest } from '../../redux/Action/ConnectionBadgeAction';
import { moderateScale, verticalScale } from '../../helpers/ResponsiveFonts';
import Image from 'react-native-scalable-image';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CometChatConversationListWithMessages } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { MessagebaseAction } from '../../redux/Action/MessageBase';
import { CometChatContextProvider } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/CometChatContext';
import messaging from '@react-native-firebase/messaging';
import { ConversationRequest } from '../../redux/Action/ConversationListAction';

const Tab = createBottomTabNavigator();
var badge = null;
var msgListenerId = `message_${new Date().getTime()}`;
export default function BottomTabNavigator({ navigation }) {
  const dispetch = useDispatch();
  const [total, setTotal] = useState(0);
  const [grouptotal, setgroupTotal] = useState(0);
  const BdgeDataResponse = useSelector(state => state.bdge);
  const MessageBdgeResponse = useSelector(state => state.messageBase);
  const contextRef = useRef(null);

  useEffect(() => {
    if (MessageBdgeResponse.count !== null) {
      if (MessageBdgeResponse.count === true) {
        setTotal(0);
        setgroupTotal(0);
        massageCountListner();
        dispetch(MessagebaseAction(null));
      }
    }
  }, [MessageBdgeResponse]);

  useEffect(() => {
    setTotal(0);
    setgroupTotal(0);
    massageCountListner();
    CometChat.addMessageListener(
      msgListenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          massageCountListner();
        },
        onMediaMessageReceived: mediaMessage => {
          massageCountListner();
        },
        onCustomMessageReceived: customMessage => {
          massageCountListner();
        },
        onMessagesDelivered: messageReceipt => {
          massageCountListner();
        },
        onMessagesRead: messageReceipt => {
          massageCountListner();
        },
        onTransientMessageReceived: transientMessage => {
          massageCountListner();
        },
      }),
    );
  }, []);

  useEffect(() => {
    //Working
    messaging().onMessage(firebaseMsg => {
      massageCountListner();
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          let payload = {
            currentUserId: UserData._id,
            action: 'active',
          };
          dispetch(ConversationRequest(payload, tokenData, navigation));
        }
      });
    });
  });

  const massageCountListner = () => {
    CometChat.getUnreadMessageCountForAllUsers(false).then(item => {
      setTotal(Object.values(item).reduce((a, v) => (a = a + v), 0));
    });

    CometChat.getUnreadMessageCountForAllGroups(false).then(item => {
      setgroupTotal(Object.values(item).reduce((a, v) => (a = a + v), 0));
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        let payload = {
          currentUserId: UserData._id,
          action: 'invites',
        };
        dispetch(ConnectionBadgeRequest(payload, tokenData, navigation));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (BdgeDataResponse.data !== null) {
      let newdata = BdgeDataResponse.data?.data;
      if (newdata.totalRecords !== 0) {
        badge = newdata.totalRecords;
      } else {
        badge = null;
      }
    } else {
      badge = null;
    }
  }, [BdgeDataResponse]);

  const tabBarOptions = {
    activeTintColor: colors.secoundry,
    inactiveTintColor: colors.charcoal,
  };

  return (
    <CometChatContextProvider ref={contextRef}>
      <Tab.Navigator
        initialRouteName={'Deshbordscreen'}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            height:
              Platform.OS === 'ios' ? verticalScale(60) : verticalScale(45),
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowColor: colors.black,
            shadowOpacity: 0.58,
            shadowRadius: 10.0,
            elevation: 15,
            backgroundColor: colors.white,
          },
          tabBarLabelStyle: {
            fontSize: moderateScale(10),
            fontFamily: fonts.Bold,
            textTransform: 'capitalize',
            fontWeight: '700',
            marginTop: verticalScale(-5),
          },
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.white,
            marginTop: 2,
            marginLeft: 2,
            fontFamily: fonts.SemiBold,
            fontSize: moderateScale(10),
          },
        }}
        tabBarOptions={tabBarOptions}>
        <Tab.Screen
          name="Deshbordscreen"
          component={Deshbordscreen}
          options={{
            tabBarLabel: 'My Circle',
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <View
                  style={[
                    style.tabview,
                    { borderTopColor: focused ? colors.secoundry : colors.white },
                  ]}>
                  <Image
                    height={moderateScale(20)}
                    style={{
                      tintColor: focused ? colors.secoundry : colors.grayMedium,
                    }}
                    resizeMode="contain"
                    source={images.expert}
                  />
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="Conversations"
          component={CometChatConversationListWithMessages}
          options={{
            tabBarLabel: 'Conversations',
            tabBarBadge: total + grouptotal !== 0 ? total + grouptotal : null,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <View
                  style={[
                    style.tabview,
                    { borderTopColor: focused ? colors.secoundry : colors.white },
                  ]}>
                  <Image
                    height={moderateScale(20)}
                    style={{
                      tintColor: focused ? colors.secoundry : colors.grayMedium,
                    }}
                    resizeMode="contain"
                    source={images.conversations}
                  />
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="Connectionscreen"
          component={Connectionscreen}
          options={{
            tabBarLabel: 'Connections',
            tabBarBadge: badge,
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <View
                  style={[
                    style.tabview,
                    { borderTopColor: focused ? colors.secoundry : colors.white },
                  ]}>
                  <Image
                    height={moderateScale(20)}
                    style={{
                      tintColor: focused ? colors.secoundry : colors.grayMedium,
                    }}
                    resizeMode="contain"
                    source={images.connections}
                  />
                </View>
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ size, focused, color }) => {
              return (
                <View
                  style={[
                    style.tabview,
                    { borderTopColor: focused ? colors.secoundry : colors.white },
                  ]}>
                  <Image
                    height={moderateScale(20)}
                    style={{
                      tintColor: focused ? colors.secoundry : colors.grayMedium,
                    }}
                    resizeMode="contain"
                    source={images.profile}
                  />
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </CometChatContextProvider>
  );
}

const style = StyleSheet.create({
  tabview: {
    width: '100%',
    height: '100%',
    borderTopWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
