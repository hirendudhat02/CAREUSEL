import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import CometChatThreadedMessageReplyCount from '../CometChatThreadedMessageReplyCount';
import CometChatReadReceipt from '../CometChatReadReceipt';
import { CometChatMessageReactions } from '../../Messages/Extensions';
import style from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import * as enums from '../../../utils/enums';
import * as actions from '../../../utils/actions';
import { logger } from '../../../utils/common';

const CometChatSenderFileMessageBubble = props => {
  const message = { ...props.message, messageFrom: enums.MESSAGE_FROM_SENDER };

  /**
   * Handler to download the file attachment in local storage
   * @param
   */
  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      const response = await downloadFile();
      return response;
    } else {
      const response = await downloadFile();
      console.log('Storage Permission Granted.');
      return response;
    }
  };
  const downloadFile = () => {
    try {
      let PictureDir =
        Platform.OS === 'ios'
          ? RNFetchBlob.fs.dirs.DocumentDir
          : RNFetchBlob.fs.dirs.DownloadDir;
      let date = new Date();
      let name = props.message.data.attachments[0].name;
      const configfb = {
        addAndroidDownloads: {
          fileCache: true,
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: name,
          path: PictureDir + '/' + name,
          appendExt: props.message.data.attachments[0].extension,
        }
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: props.message.data.attachments[0].extension,
        },
        android: configfb,
      });

      RNFetchBlob.config(configOptions)
        .fetch('GET', props.message.data.attachments[0].url, {
          // some headers ..
        })
        .then(res => {
          if (Platform.OS === 'ios') {
            //Should be explicitly saved in ios device
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          } else {
            RNFetchBlob.android.actionViewIntent(
              res.path(),
              props.message.data.attachments[0].mimeType,
            );
            Alert.alert('File Downloaded');
          }

        });
    } catch (error) {
      logger(error);
    }
  };

  return (
    <View style={style.container}>
      <TouchableWithoutFeedback
        onPress={checkPermission}
        onLongPress={() =>
          props.actionGenerated(actions.OPEN_MESSAGE_ACTIONS, message)
        }>
        <View style={style.messageWrapperStyle}>
          <View style={style.messageDetailContainer}>
            <Text style={style.messageTextStyle}>
              {props.message.data.attachments[0].name}
            </Text>
          </View>
          <Icon name="file-download-outline" size={24} color="#fff" />
          <View style={style.triangle} />
        </View>
      </TouchableWithoutFeedback>
      <View style={style.messageInfoWrapperStyle}>
        <CometChatThreadedMessageReplyCount {...props} message={message} />
        <CometChatReadReceipt {...props} message={message} />
      </View>
      <CometChatMessageReactions
        theme={props.theme}
        {...props}
        message={message}
        showMessage={props?.showMessage}
      />
    </View>
  );
};
export default CometChatSenderFileMessageBubble;
