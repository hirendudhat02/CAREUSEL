import { CometChat } from '@cometchat-pro/react-native-chat';
import _ from 'lodash';
import React from 'react';
import { Image, Platform } from 'react-native';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import VideoPlayer from 'react-native-video-controls';
import { images } from '../../../../../../assets';
import theme from '../../../resources/theme';
import { CometChatContext } from '../../../utils/CometChatContext';
import { logger } from '../../../utils/common';
import { deviceHeight, heightRatio } from '../../../utils/consts';
import { CometChatManager } from '../../../utils/controller';
import * as enums from '../../../utils/enums';
import CometChatImageViewer from '../../Messages/CometChatImageViewer';
import CometChatVideoViewer from '../../Messages/CometChatVideoViewer';
import DropDownAlert from '../../Shared/DropDownAlert';
import { SharedMediaManager } from './controller';
import styles from './styles';

export default class CometChatSharedMedia extends React.Component {
  decoratorMessage = 'Loading...';
  static contextType = CometChatContext;
  constructor(props) {
    super(props);

    this.state = {
      messageType: CometChat.MESSAGE_TYPE.IMAGE,
      messageList: [],
      imageView: false,
      videoView: false,
      activeMessage: {},
    };

    this.messageContainer = React.createRef();
  }

  componentDidMount() {
    this.SharedMediaManager = new SharedMediaManager(
      this.props.item,
      this.props.type,
      this.state.messageType,
      this.context,
    );
    this.getMessages();
    this.SharedMediaManager.attachListeners(this.messageUpdated);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messageType !== this.state.messageType) {
      this.decoratorMessage = 'Loading...';
      this.SharedMediaManager = null;
      this.SharedMediaManager = new SharedMediaManager(
        this.props.item,
        this.props.type,
        this.state.messageType,
        this.context,
      );
      this.getMessages();
      this.SharedMediaManager.attachListeners(this.messageUpdated);
    }
  }

  componentWillUnmount() {
    this.SharedMediaManager.removeListeners();
    this.SharedMediaManager = null;
  }

  /**
   * Handle listener actions on new message or message deletion
   * @param key: action name
   * @param message: message object
   */
  messageUpdated = (key, message) => {
    switch (key) {
      case enums.MESSAGE_DELETED:
        this.messageDeleted(message);
        break;
      case enums.MEDIA_MESSAGE_RECEIVED:
        this.messageReceived(message);
        break;
      default:
        break;
    }
  };

  /**
   * Update shared media view on message deleted
   * @param deletedMessage: message object
   */
  messageDeleted = deletedMessage => {
    const messageType = deletedMessage.data.type;
    if (
      this.props.type === CometChat.RECEIVER_TYPE.GROUP &&
      deletedMessage.getReceiverType() === CometChat.RECEIVER_TYPE.GROUP &&
      deletedMessage.getReceiver().guid === this.props.item.guid &&
      messageType === this.state.messageType
    ) {
      const messageList = [...this.state.messageList];
      const filteredMessages = messageList.filter(
        message => message.id !== deletedMessage.id,
      );
      this.setState({ messageList: filteredMessages });
    }
  };

  /**
   * Update shared media view on message received
   * @param message: message object
   */
  messageReceived = message => {
    const messageType = message.data.type;
    if (
      this.props.type === CometChat.RECEIVER_TYPE.GROUP &&
      message.getReceiverType() === CometChat.RECEIVER_TYPE.GROUP &&
      message.getReceiver().guid === this.props.item.guid &&
      messageType === this.state.messageType
    ) {
      let messages = [...this.state.messageList];
      messages = messages.concat(message);
      this.setState({ messageList: messages });
    }
  };

  /**
   * Retrieve message list according to logged in user
   * @param
   */
  getMessages = () => {
    new CometChatManager()
      .getLoggedInUser()
      .then(user => {
        this.loggedInUser = user;
        this.SharedMediaManager.fetchPreviousMessages()
          .then(messages => {
            let messageList = [...messages, ...this.state.messageList];
            messageList = _.uniqBy(messageList, 'id');
            messageList = messageList.sort((a, b) => b.id - a.id);
            if (messageList.length === 0) {
              this.decoratorMessage = 'NO DATA';
            }
            this.setState({ messageList });
          })
          .catch(error => {
            const errorCode = error?.message || 'ERROR';
            this.decoratorMessage = "ERROR"
            this.props?.showMessage('error', errorCode);
            logger(
              '[CometChatSharedMedia] getMessages fetchPrevious error',
              error,
            );
          });
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.props?.showMessage('error', errorCode);
        logger(
          '[CometChatSharedMedia] getMessages getLoggedInUser error',
          error,
        );
      });
  };

  /**
   * Scroll to bottom
   * @param
   */
  scrollToBottom = () => {
    if (this.messageContainer) {
      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
  };

  /**
   * Handle on end reached of shared media list
   * @param e: scroll event
   */
  handleScroll = e => {
    const top = Math.round(e.currentTarget.scrollTop) === 0;
    if (top && this.state.messageList.length) {
      this.getMessages();
    }
  };

  /**
   * Handle media message clicked from the list
   * @param type:media message clicked type
   */
  mediaClickHandler = type => {
    this.setState({ messageType: type, messageList: [] });
  };

  /**
   * Get active message type - Images or Videos or Files
   * @returns activeHeaderName for shared media
   */
  getActiveType = () => {
    if (this.state.messageType === CometChat.MESSAGE_TYPE.IMAGE) {
      return 'Photos';
    }
    if (this.state.messageType === CometChat.MESSAGE_TYPE.FILE) {
      return 'Docs';
    }
    return 'Videos';
  };

  /**
   * Handle opening image view on  click on particular image from message list
   * @param message: message object
   */
  showImageView = message => {
    this.setState({ imageView: true, activeMessage: message });
  };

  /**
   * Handle closing image view
   * @param
   */
  hideImageView = () => {
    this.setState({ imageView: false });
  };

  /**
   * Handle opening video view on  click on particular video from message list
   * @param message: message object
   */
  showVideoView = message => {
    this.setState({ videoView: true, activeMessage: message });
  };

  /**
   * Handle closing video view
   * @param
   */
  hideVideoView = () => {
    this.setState({ videoView: false });
  };

  /**
   * Return empty list component
   * @param
   */
  emptyListComponent = () => {
    return (
      <View style={styles.emptyComponentContainerStyle}>
        {
          this.decoratorMessage === "NO DATA" ? (<View
            style={{ backgroundColor: '#f5f6f9', padding: 40, borderRadius: 200 }}>
            <FastImage
              source={images.nodataicon}
              style={{ height: 80, width: 80 }}
              resizeMode="contain"
            />

          </View>) : null}
        <Text
          style={
            styles.emptyComponentStyle
          }>{this.decoratorMessage === "NO DATA" ? `No ${this.getActiveType()}` : this.decoratorMessage}</Text>
      </View>
    );
  };

  render() {
    const currentTheme = { ...theme, ...this.props.theme };
    const { messageType, messageList, imageView, videoView, activeMessage } =
      this.state;

    const bgColor = currentTheme.backgroundColor.lightGrey;

    let imagesData = []
    messageList.forEach((element) => {
      element?.data?.attachments.forEach((item) => {
        imagesData.push(item)
      })
    })

    const template = (message, index) => {
      if (messageType === CometChat.MESSAGE_TYPE.IMAGE && message?.url) {
        return (
          <>
            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <>
                <TouchableOpacity
                  style={[
                    styles.itemStyle,
                    {
                      backgroundColor: bgColor,
                    },
                  ]}
                  onPress={() => {
                    this.showImageView(message);
                  }}
                >
                  <FastImage
                    source={{ uri: message.url }}
                    style={styles.imageStyle}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </TouchableOpacity>
              </>
            </View>
          </>
        );
      }
      if (messageType === CometChat.MESSAGE_TYPE.VIDEO && message.data.attachments) {
        return (

          <View style={[styles.videoStyle]}>
            <VideoPlayer
              source={{ uri: message.data.attachments[0]?.url }}
              navigator={this.props.navigator}
              disableBack
              disableSeekbar
              disableFullscreen
              disableVolume
              paused
              style={[styles.videoPlayerStyle]}
              muted
              onError={() => {
                logger('error while loading video', JSON.stringify(message));
              }}
              resizeMode="contain"
              controlTimeout={200}
              onShowControls={() => this.showVideoView(message)}
            />
          </View>


        );
      }
      if (
        messageType === CometChat.MESSAGE_TYPE.FILE &&
        message.data.attachments
      ) {
        return (

          <TouchableOpacity
            style={[styles.fileItemStyle, { backgroundColor: bgColor }]}
            onPress={() => Linking.openURL(message.data.attachments[0].url)}>
            <Icon name="file-alt" size={44} color="rgba(0,0,0,0.5)" />
            <Text
              ellipsizeMode="middle"
              numberOfLines={1}
              style={[
                styles.fileStyle,
                { color: `${currentTheme.color.primary}` },
              ]}>
              {message.data.attachments[0]?.name}
            </Text>
          </TouchableOpacity>
        );
      }
    };
    const messages = [...messageList];

    return (
      <View style={[styles.sectionStyle, {}]}>
        {imageView ? (
          <CometChatImageViewer
            open={imageView}
            close={this.hideImageView}
            message={activeMessage}
            sharedMedia={true}
          />
        ) : null}
        {videoView ? (
          <CometChatVideoViewer
            open={this.state.videoView}
            close={this.hideVideoView}
            message={activeMessage}
          />
        ) : null}
        {this.props.type === CometChat.RECEIVER_TYPE.USER && (
          <Text
            style={[
              styles.sectionHeaderStyle,
              {
                color: currentTheme.color.primary,
              },
            ]}>
            Shared Media
          </Text>
        )}

        <View style={[styles.sectionContentStyle]}>
          <View style={styles.mediaBtnStyle}>
            <TouchableOpacity
              disabled={
                messageType === CometChat.MESSAGE_TYPE.IMAGE ? true : false
              }
              onPress={() =>
                this.mediaClickHandler(CometChat.MESSAGE_TYPE.IMAGE)
              }
              style={[
                messageType === CometChat.MESSAGE_TYPE.IMAGE
                  ? styles.activeButtonStyle
                  : styles.buttonStyle,
              ]}>
              <Text
                style={[
                  styles.buttonTextStyle,
                  {
                    color:
                      messageType === CometChat.MESSAGE_TYPE.IMAGE
                        ? currentTheme.color.secoundry
                        : currentTheme.color.primary,
                  },
                ]}>
                Photos
              </Text>
            </TouchableOpacity>
            {/* {messageType === CometChat.MESSAGE_TYPE.FILE ? (
              <View style={styles.separator} />
            ) : null} */}
            <TouchableOpacity
              disabled={
                messageType === CometChat.MESSAGE_TYPE.VIDEO ? true : false
              }
              onPress={() =>
                this.mediaClickHandler(CometChat.MESSAGE_TYPE.VIDEO)
              }
              style={
                messageType === CometChat.MESSAGE_TYPE.VIDEO
                  ? styles.activeButtonStyle
                  : styles.buttonStyle
              }>
              <Text
                style={[
                  styles.buttonTextStyle,
                  {
                    color:
                      messageType === CometChat.MESSAGE_TYPE.VIDEO
                        ? currentTheme.color.secoundry
                        : currentTheme.color.primary,
                  },
                ]}>
                Videos
              </Text>
            </TouchableOpacity>
            {/* {messageType === CometChat.MESSAGE_TYPE.IMAGE ? (
              <View style={styles.separator} />
            ) : null} */}
            <TouchableOpacity
              disabled={
                messageType === CometChat.MESSAGE_TYPE.FILE ? true : false
              }
              onPress={() =>
                this.mediaClickHandler(CometChat.MESSAGE_TYPE.FILE)
              }
              style={[
                messageType === CometChat.MESSAGE_TYPE.FILE
                  ? styles.activeButtonStyle
                  : styles.buttonStyle,
              ]}>
              <Text
                style={[
                  styles.buttonTextStyle,
                  {
                    color:
                      messageType === CometChat.MESSAGE_TYPE.FILE
                        ? currentTheme.color.secoundry
                        : currentTheme.color.primary,
                  },
                ]}>
                Docs
              </Text>
            </TouchableOpacity>
          </View>
          {messageType === CometChat.MESSAGE_TYPE.IMAGE ? (<FlatList
            data={imagesData}
            extraData={messageType}
            renderItem={({ item, index }) => {
              return template(item, index);
            }}
            style={{
              maxHeight:
                Platform.OS === 'ios'
                  ? deviceHeight * 0.65
                  : deviceHeight * 0.7,
            }}
            nestedScrollEnabled
            contentContainerStyle={[
              messages?.length ? null : styles.mediaItemStyle,
            ]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ListEmptyComponent={this.emptyListComponent}
            onEndReached={this.getMessages}
          />) : null}
          {messageType !== CometChat.MESSAGE_TYPE.IMAGE ? (<FlatList
            data={messages}
            extraData={messageType}
            renderItem={({ item, index }) => {
              return template(item, index);
            }}
            style={{
              maxHeight:
                Platform.OS === 'ios'
                  ? deviceHeight * 0.65
                  : deviceHeight * 0.7,
            }}
            nestedScrollEnabled
            // columnWrapperStyle={styles.mediaItemColumnStyle}
            contentContainerStyle={[
              messages?.length ? null : styles.mediaItemStyle,
            ]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ListEmptyComponent={this.emptyListComponent}
            onEndReached={this.getMessages}
          />) : null}
        </View>

        <DropDownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </View>
    );
  }
}
