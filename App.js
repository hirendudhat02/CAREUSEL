import {
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import store from './src/redux/Store/store';
import { SheetProvider } from 'react-native-actions-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import { requestUserPermission } from './src/service/NotificationService';
import UnAuth from './src/routes/stack/UnAuth';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COMETCHAT_CONSTANTS } from './src/CONSTS';
import { fonts } from './src/theme';
const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: fonts.Normal,
    fontSize: 14,
  },
});

const customProps = { style: styles.defaultFontFamily };

// To set default font family, avoiding issues with specific android fonts like OnePlus Slate
function setDefaultFontFamily() {
  const TextRender = Text.render;
  const initialDefaultProps = Text.defaultProps;
  Text.defaultProps = {
    ...initialDefaultProps,
    ...customProps,
  };
  Text.render = function render(props) {
    let oldProps = props;
    props = { ...props, style: [customProps.style, props.style] };
    try {
      return TextRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
}

const App = () => {
  LogBox.ignoreAllLogs();
  var appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    // .autoEstablishSocketConnection(true)
    .build();

  useEffect(() => {
    CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting)
      .then(() => {
        if (CometChat.setSource) {
          CometChat.setSource('ui-kit', Platform.OS, 'react-native');
        }
      })
      .catch(() => {
        return null;
      });

    if (Platform.OS === 'android') {
      setDefaultFontFamily();
    }
    requestUserPermission();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SheetProvider>
        <Provider store={store}>
          {/* <CometChatContextProvider> */}
          <RootSiblingParent>
            <UnAuth />
            <FlashMessage
              position="top"
              autoHide={true}
              floating={true}
              style={{ borderRadius: 10, marginHorizontal: 5 }}
            />
          </RootSiblingParent>
          {/* </CometChatContextProvider> */}
        </Provider>
      </SheetProvider>
    </GestureHandlerRootView>
  );
};

export default App;
