/* eslint-disable import/no-named-as-default */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import CometChatThreadedMessageReplyCount from '../CometChatThreadedMessageReplyCount';
import CometChatReadReceipt from '../CometChatReadReceipt';
import CometChatMessageReactions from '../../Messages/Extensions/CometChatMessageReactions';
import style from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import CometChatAvatar from '../../Shared/CometChatAvatar';
import * as enums from '../../../utils/enums';
import * as actions from '../../../utils/actions';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logger } from '../../../utils/common';
import { Text } from '../../../../../../components';

const CometChatReceiverFileMessageBubble = props => {
  const message = {
    ...props.message,
    messageFrom: enums.MESSAGE_FROM_RECEIVER,
  };
  let avatarImg = '';

  if (message.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
    avatarImg = { uri: message.sender.avatar };
  }

  /**
   * Handler for downloading file attachment in local storage.
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
      // try {
      //   const granted = await PermissionsAndroid.requestMultiple(
      //     "android.permission.WRITE_EXTERNAL_STORAGE",
      //     {
      //       title: 'Storage Permission Required',
      //       message: 'Application needs access to your storage to download File',
      //     },
      //   );
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     // Start downloading
      //     const response = await downloadFile();
      //     console.log('Storage Permission Granted.');
      //     return response;
      //   } else {
      //     // If permission denied then show alert
      //     Alert.alert('Error', 'Storage Permission Not Granted');
      //   }
      // } catch (err) {
      //   // To handle permission related exception
      //   console.log('++++' + err);
      // }
    }
  };

  const downloadFile = () => {
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
        logger('res', res);
        if (Platform.OS === 'ios') {
          //Should be explicitly saved in ios device
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        } else {
          RNFetchBlob.android.actionViewIntent(
            res.path(),
            props.message.data.attachments[0]?.mimeType,
          );
          Alert.alert('File Downloaded');
        }
      })
      .catch(error => {
        logger('The file saved to ERROR', error.message);
      });
  };
  return (
    <View style={style.mainContainerStyle}>
      <View style={style.messageContainer}>
        {props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP ? (
          <View style={style.avatarStyle}>
            <CometChatAvatar
              cornerRadius={18}
              borderColor={props.theme.color.secondary}
              borderWidth={0}
              image={avatarImg}
              name={message.sender.name}
            />
          </View>
        ) : null}
        <View>
          <View style={style.messageContainerStyle}>
            <TouchableWithoutFeedback
              onPress={checkPermission}
              onLongPress={() => {
                if (
                  props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP
                ) {
                  props.actionGenerated(actions.OPEN_MESSAGE_ACTIONS, message);
                }
              }}>
              <View
                style={[
                  style.messageWrapperStyle,
                  { backgroundColor: '#cc9933' },
                ]}>
                <View style={style.attachmentNameStyle}>
                  {props.message.receiverType ===
                    CometChat.RECEIVER_TYPE.GROUP ? (
                    <View style={style.senderNameContainer}>
                      <Text
                        style={{
                          color: props.theme.color.white,
                          fontSize: 12,
                          fontWeight: '500',
                        }}>
                        {message.sender.name}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={[style.attachmentName, { color: '#FFF' }]}>
                    {props.message.data.attachments[0].name}
                  </Text>
                </View>
                <Icon name="file-download-outline" size={25} color="#FFF" />
                <View style={style.triangle} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={style.containerStyle}>
            <View style={style.messageInfoWrapperStyle}>
              <CometChatReadReceipt {...props} message={message} />
              <CometChatThreadedMessageReplyCount
                {...props}
                message={message}
              />
            </View>
            <CometChatMessageReactions
              theme={props.theme}
              {...props}
              message={message}
              showMessage={props?.showMessage}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default CometChatReceiverFileMessageBubble;
