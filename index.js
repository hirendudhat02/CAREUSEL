/**
 * @format
 */
import 'react-native-gesture-handler';
import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {
  setJSExceptionHandler,
  getJSExceptionHandler,
} from 'react-native-exception-handler';


const exceptionhandler = (e, isFatal) => {
  // Alert.alert('error', error.name, error.message);
  // Alert.alert(
  //   'Unexpected error occurred',
  //   `
  //   Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}

  //   We will need to restart the app.
  //   `,
  //   [
  //     {
  //       text: 'Restart',
  //       onPress: () => {
  //         // RNRestart.Restart();
  //       },
  //     },
  //   ],
  // );
  // your error handler function
};
setJSExceptionHandler(exceptionhandler, true);
AppRegistry.registerComponent(appName, () => App);
