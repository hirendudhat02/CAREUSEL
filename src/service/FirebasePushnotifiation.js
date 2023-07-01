import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { TabActions } from '@react-navigation/native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class FirebasePushnotifiation {
  initFirebaseService(navigation, dispetch) {

    // PushNotification.configure({
    //   onNotification: function (notification) {
    //     // notification.finish(PushNotificationIOS.FetchResult.NoData);
    //   },
    //   // IOS ONLY (optional): default: all - Permissions to register.
    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    //   },
    //   // Should the initial notification be popped automatically
    //   // default: true
    //   popInitialNotification: false,
    //   /**
    //    * (optional) default: true
    //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    //    */
    //   requestPermissions: true,
    // });

    //Working
    messaging().onMessage(async firebaseMsg => {
      // this.generateLocalNotification(firebaseMsg);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async notification => {
      this.generateLocalNotification(notification);
    });

    //Working
    messaging()
      .getInitialNotification()
      .then(data => {
        this.navigationManager(data, navigation);
      });

    messaging().onNotificationOpenedApp(notification => {
      this.navigationManager(notification, navigation);
    });
  }

  navigationManager(notificationObj, navigation) {
    if (notificationObj != null) {
      if (notificationObj.title !== null) {
        console.log('call inside');
        if (
          notificationObj.title ===
          'You have recieved a new connection request!'
        ) {
          const jump = TabActions.jumpTo('Connectionscreen');
          navigation.dispatch(jump);
        } else {
          const jump = TabActions.jumpTo('Conversations');
          navigation.dispatch(jump);
        }
      }
    }
  }

  generateLocalNotification(remoteMessage) {
    // console.log("remoteMessage:", remoteMessage)
    PushNotification.createChannel(
      {
        channelId: 'Careusel', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned'${created}'`),
    );

    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'Careusel', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        showWhen: true, // (optional) default: true
        autoCancel: true, // (optional) default: true
        // largeIcon: require("../../android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png"), // (optional) default: "ic_launcher". Use "" for no large icon.
        // largeIconUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined

        smallIcon: 'appicon', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        largeIcon: 'appicon',

        // color: Colors.backgroundColor, // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
        when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
        usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.

        data: remoteMessage?.data, // this param use when user click notification in foreground app most important
        /* iOS and Android properties */
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: remoteMessage?.notification.title, // (optional)
        message: remoteMessage?.notification.body, // (required)
        // picture: remoteMessage?.notification.android?.imageUrl, // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // actions: ['Yes', 'No'],
        invokeApp: true,
      });
    } else {
      PushNotification.createChannel(
        {
          channelId: 'Careusel', // (required)
          channelName: 'My channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned'${created}'`),
      );
      PushNotificationIOS.requestPermissions([
        'alert',
        'badge',
        'sound',
        'critical',
      ]);
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'Careusel', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        showWhen: true, // (optional) default: true
        autoCancel: true, // (optional) default: true
        // largeIcon: require("../../android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png"), // (optional) default: "ic_launcher". Use "" for no large icon.
        // largeIconUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
        smallIcon: 'appicon', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        largeIcon: 'appicon',
        // color: Colors.backgroundColor, // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
        when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
        usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.

        data: remoteMessage.data, // this param use when user click notification in foreground app most important
        /* iOS and Android properties */
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        // picture: remoteMessage.data.fcm_options.image, // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
        userInfo: remoteMessage.data,
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // actions: ['Yes', 'No'],
        invokeApp: true,
      });
      remoteMessage.finish(PushNotificationIOS?.FetchResult?.NoData);
    }
  }
}

export default FirebasePushnotifiation;
