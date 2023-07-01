import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import CometChatAvatar from '../../Shared/CometChatAvatar';
import CometChatThreadedMessageReplyCount from '../CometChatThreadedMessageReplyCount';
import CometChatReadReceipt from '../CometChatReadReceipt';
import CometChatMessageReactions from '../../Messages/Extensions/CometChatMessageReactions';
import style from './styles';
import theme from '../../../resources/theme';
import * as enums from '../../../utils/enums';
import * as actions from '../../../utils/actions';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { Text } from 'react-native-elements';
import { colors } from '../../../../../../theme';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const CometChatReceiverImageMessageBubble = props => {
  const [message, setMessage] = useState({
    ...props.message,
    messageFrom: enums.MESSAGE_FROM_RECEIVER,
  });
  const prevMessage = usePrevious(message);
  const viewTheme = { ...theme, ...props.theme };
  let senderAvatar = null;
  if (message.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
    senderAvatar = { uri: message.sender.avatar };
  }
  const open = () => {
    props.actionGenerated(actions.VIEW_ACTUAL_IMAGE, message);
  };

  useEffect(() => {
    const previousMessageStr = JSON.stringify(prevMessage);
    const currentMessageStr = JSON.stringify(props.message);

    if (previousMessageStr !== currentMessageStr) {
      const newMessage = {
        ...props.message,
        messageFrom: enums.MESSAGE_FROM_RECEIVER,
      };
      setMessage(newMessage);
    }
  }, [props]);

  let thumbnailGenerationObject = null;
  if (Object.prototype.hasOwnProperty.call(message, 'metadata')) {
    const { metadata } = message;
    const injectedObject = metadata['@injected'];
    if (
      injectedObject &&
      Object.prototype.hasOwnProperty.call(injectedObject, 'extensions')
    ) {
      const extensionsObject = injectedObject.extensions;
      if (
        extensionsObject &&
        Object.prototype.hasOwnProperty.call(
          extensionsObject,
          'thumbnail-generation',
        )
      ) {
        thumbnailGenerationObject = extensionsObject['thumbnail-generation'];
      }
    }
  }
  return (
    <View style={style.container}>
      <View style={style.mainContainer}>
        {props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP ? (
          <View style={style.avatarStyle}>
            <CometChatAvatar
              cornerRadius={18}
              borderColor={viewTheme.color.secondary}
              borderWidth={0}
              image={senderAvatar}
              name={message.sender.name}
            />
          </View>
        ) : null}
        <View>
          {props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP ? (
            <View style={style.senderNameContainer}>
              <Text style={{ color: viewTheme.color.helpText }}>
                {message.sender.name}
              </Text>
            </View>
          ) : null}
          <View style={[style.messageWrapperStyle]}>
            <TouchableOpacity
              onPress={() => open()}
              style={style.messageImgWrapperStyle}
              onLongPress={() => {
                if (
                  props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP
                ) {
                  props.actionGenerated(actions.OPEN_MESSAGE_ACTIONS, message);
                }
              }}>
              {message.data?.attachments.length === 1 ? (<>
                <FastImage
                  // defaultSource={{
                  //   uri: message?.localFile?.url,
                  // }}
                  style={{
                    marginTop: 10,
                    width: 270,
                    height: 180,
                  }}
                  source={{
                    uri: message.data?.attachments[0]?.url,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </>) : (<>
                <FlatList data={message.data?.attachments}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ marginTop: 10, width: "50%" }}>
                        {index < 4 ? (<>
                          <FastImage
                            // defaultSource={{
                            //   uri: message?.localFile?.url,
                            // }}
                            style={[style.messageImg, { height: message.data?.attachments.length === 2 ? 180 : 85 }]}
                            source={{
                              uri: item?.url,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          /></>) : null}

                      </View>
                    )
                  }} /></>)}
              {message.data?.attachments.length > 4 ? (
                <View style={{
                  position: "absolute", bottom: 10, right: 8, backgroundColor: 'rgba(20, 20, 20, 0.6)', height: 85, width: 120, borderRadius: 8, alignItems: "center", justifyContent: "center"
                }}>
                  <Text style={{ fontSize: 25, color: colors.white }}>+ {message.data?.attachments.length - 3}</Text>
                </View>) : null}
            </TouchableOpacity>
          </View>
          <View style={style.messageInfoWrapperStyle}>
            <CometChatReadReceipt {...props} message={message} />

            <CometChatThreadedMessageReplyCount {...props} message={message} />
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

export default CometChatReceiverImageMessageBubble;
