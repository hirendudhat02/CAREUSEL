import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  getToken();
}

const getToken = async () => {
  let checkToken = await AsyncStorage.getItem('fcmToken');
  console.log('checkToken=======', checkToken);
  if (!checkToken) {
    try {
      const fcmToken = await messaging().getToken();
      console.log('fcm Token generated::::', fcmToken);
      if (fcmToken) {
        console.log('fcm Token Generated:::', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('error in fcmToken', error);
      // Alert.alert(error?.message);
    }
  }
};
