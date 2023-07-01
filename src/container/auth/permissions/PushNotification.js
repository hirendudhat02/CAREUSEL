import React from 'react';
import { Alert, Linking, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import { Button, Container, Icon, Text } from '../../../components';
import { moderateScale } from '../../../helpers/ResponsiveFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FcmTokenRequest } from '../../../redux/Action/FcmTokenAction';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from '../../../service/NotificationService';
const PushNotification = ({ navigation }) => {
  const dispetch = useDispatch();
  const navigateFuction = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      messaging.NotificationAndroidPriority.PRIORITY_HIGH;
      messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC;
      if (enabled) {
        requestUserPermission();
        setTimeout(async () => {
          let checkToken = await AsyncStorage.getItem('fcmToken');
          AsyncStorage.getItem('userdata').then(Data => {
            if (Data !== null) {
              let UserData = JSON.parse(Data);
              let tokenData = UserData.accessToken[0];
              let payload = {
                id: UserData._id,
                fcmDeviceToken: checkToken,
                deviceType: Platform.OS,
              };
              dispetch(FcmTokenRequest(payload, tokenData));
            }
          });
          navigation.replace('HomeStack');
        }, 500);
      } else {
        requestUserPermission();
        setTimeout(async () => {
          let checkToken = await AsyncStorage.getItem('fcmToken');
          AsyncStorage.getItem('userdata').then(Data => {
            if (Data !== null) {
              let UserData = JSON.parse(Data);
              let tokenData = UserData.accessToken[0];
              let payload = {
                id: UserData._id,
                fcmDeviceToken: checkToken,
                deviceType: Platform.OS,
              };
              dispetch(FcmTokenRequest(payload, tokenData));
            }
          });
          navigation.replace('HomeStack');
        }, 500);
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
        setTimeout(async () => {
          let checkToken = await AsyncStorage.getItem('fcmToken');
          AsyncStorage.getItem('userdata').then(Data => {
            if (Data !== null) {
              let UserData = JSON.parse(Data);
              let tokenData = UserData.accessToken[0];
              let payload = {
                id: UserData._id,
                fcmDeviceToken: checkToken,
                deviceType: Platform.OS,
              };
              dispetch(FcmTokenRequest(payload, tokenData));
            }
          });
          navigation.replace('HomeStack');
        }, 500);
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
                setTimeout(async () => {
                  let checkToken = await AsyncStorage.getItem('fcmToken');
                  AsyncStorage.getItem('userdata').then(Data => {
                    if (Data !== null) {
                      let UserData = JSON.parse(Data);
                      let tokenData = UserData.accessToken[0];
                      let payload = {
                        id: UserData._id,
                        fcmDeviceToken: checkToken,
                        deviceType: Platform.OS,
                      };
                      dispetch(FcmTokenRequest(payload, tokenData));
                    }
                  });
                  navigation.replace('HomeStack');
                }, 500);
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
  };
  return (
    <View style={{ flexGrow: 1 }}>
      <Container
        title={'Push Notifications'}
        iconLeft={'Back'}
        onIconLeftPress={() => navigation.goBack()}>
        <View style={styles.txtview}>
          <Icon name={'pushnotification'} size={300} disabled={true} />
        </View>
        <Text isSemiBold style={styles.enabletxt}>
          Enable Push Notifications
        </Text>
        <Text style={styles.detailstxt}>
          Careusel delivers time sensitive and important messages from your
          health & wellness experts. For that reason, it's important to enable
          push notifications.
        </Text>
        <View style={styles.buttonview}>
          <Button
            onPress={() => {
              navigation.replace('HomeStack');
            }}
            isOutlined
            label={'Skip'}
          />
          <Button
            onPress={() => {
              navigateFuction();
            }}
            label={'I Accept'}
          />
        </View>
      </Container>
    </View>
  );
};

export default PushNotification;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  txtview: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  enabletxt: { textAlign: 'center', marginTop: 20, fontSize: moderateScale(20) },
  detailstxt: {
    textAlign: 'center',
    fontSize: moderateScale(18),
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonview: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 40,
  },
});
