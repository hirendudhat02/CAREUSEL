import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BottomSheet from 'reanimated-bottom-sheet';
import style from './styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { heightRatio } from '../../../utils/consts';
import { CometChatContext } from '../../../utils/CometChatContext';
import { colors } from '../../../../../../theme';
import theme from '../../../resources/theme';

export default class ComposerActions extends Component {
  sheetRef = React.createRef(null);
  static contextType = CometChatContext;
  constructor(props) {
    super(props);
    this.state = {
      restrictions: null,
      snapPoints: null,
    };
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.sheetRef?.current?.open();
    }
  }

  componentDidMount() {
    this.checkRestrictions();
  }
  checkRestrictions = async () => {
    let isPollsEnabled = await this.context.FeatureRestriction.isPollsEnabled();
    let isStickersEnabled = true;
    let isFilesEnabled = true;
    let isPhotosVideosEnabled = true;
    let height = 0;
    if (isPollsEnabled) {
      height++;
    }
    if (isStickersEnabled) {
      height++;
    }
    if (isFilesEnabled) {
      height++;
    }
    if (isPhotosVideosEnabled) {
      height += 4;
    }
    this.setState({
      restrictions: {
        isPollsEnabled,
        isStickersEnabled,
        isFilesEnabled,
        isPhotosVideosEnabled,
      },
      snapPoints: [height * 60 * heightRatio, 0],
    });
  };
  onRequestPremission = async (type) => {
    if (Platform.OS === 'ios') {
      if (type === "video") {
        this.takeVideo(type);
      } else {
        this.takePhoto(type);
      }

    } else {
      try {
        const granted = await PermissionsAndroid.request(
          'android.permission.CAMERA',
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          if (type === "video") {
            this.takeVideo(type);
          } else {
            this.takePhoto(type);
          }
        } else {
          Alert.alert(
            'Oops!!',
            'Permission not granted for Camera',
            [
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Cancel',
                style: 'destructive',
              },
            ],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  takePhoto = async (mediaType = 'photo') => {
    try {
      launchCamera(
        {
          mediaType: mediaType,
          includeBase64: true,
          cameraType: 'back',
        },
        response => {
          this.sheetRef?.current?.close();
          this.props.close();
          if (response.didCancel) {
            return null;
          }
          let type = null;
          let name = null;

          if (
            Platform.OS === 'ios' &&
            response.assets[0].fileName !== undefined
          ) {
            name = response.assets[0].fileName;
            type = response.assets[0].type;
          } else {
            type = response.assets[0].type;
            name = 'Camera_001.jpeg';
          }
          if (mediaType === 'video') {
            type = 'video/quicktime';
            name = 'Camera_002.mov';
          }
          const file = {
            name:
              Platform.OS === 'android' && mediaType !== 'video'
                ? response.assets[0].fileName
                : name,
            type:
              Platform.OS === 'android' && mediaType !== 'video'
                ? response.assets[0].type
                : type,
            uri:
              Platform.OS === 'android'
                ? response.assets[0].uri
                : response.assets[0].uri.replace('file://', ''),
          };
          this.props.sendMediaMessage(
            file,
            mediaType === 'photo'
              ? CometChat.MESSAGE_TYPE.IMAGE
              : CometChat.MESSAGE_TYPE.VIDEO,
          );
        },
      );
    } catch (err) {
      this.sheetRef?.current?.close();
      this.props.close();
    }
  };


  takeVideo = async (mediaType = 'video') => {
    try {
      launchCamera(
        {
          mediaType: mediaType,
          includeBase64: true,
          cameraType: 'back',
        },
        response => {
          this.sheetRef?.current?.close();
          this.props.close();
          if (response.didCancel) {
            return null;
          }
          let type = null;
          let name = null;

          if (
            Platform.OS === 'ios' &&
            response.assets[0].fileName !== undefined
          ) {
            name = response.assets[0].fileName;
            type = response.assets[0].type;
          } else {
            type = response.assets[0].type;
            name = 'Camera_001.jpeg';
          }
          if (mediaType === 'video') {
            type = 'video/quicktime';
            name = 'Camera_002.mov';
          }
          const file = {
            name:
              Platform.OS === 'android' && mediaType !== 'video'
                ? response.assets[0].fileName
                : name,
            type:
              Platform.OS === 'android' && mediaType !== 'video'
                ? response.assets[0].type
                : type,
            uri:
              Platform.OS === 'android'
                ? response.assets[0].uri
                : response.assets[0].uri.replace('file://', ''),
          };
          this.props.sendMediaMessage(
            file,
            mediaType === 'photo'
              ? CometChat.MESSAGE_TYPE.IMAGE
              : CometChat.MESSAGE_TYPE.VIDEO,
          );
        },
      );
    } catch (err) {
      this.sheetRef?.current?.close();
      this.props.close();
    }
  };


  launchLibrary = async mediaType => {
    try {
      launchImageLibrary(
        {
          mediaType: "photo",
          includeBase64: false,
          cameraType: 'back',
          selectionLimit: 10,
        },
        response => {
          this.sheetRef?.current?.close();
          this.props.close();
          if (response.didCancel) {
            return null;
          }
          let fileData = []
          if (response.assets.length !== 0) {
            response.assets.forEach((item, index) => {
              let type = null;
              let name = null;
              if (
                Platform.OS === 'ios' &&
                item.fileName !== undefined
              ) {
                name = item.fileName;
                type = item.type;
              } else {
                type = item.type;
                name = 'Camera_001.jpeg';
              }
              if (mediaType === 'video') {
                type = 'video/quicktime';
                name = 'Camera_002.mov';
              }
              const file = {
                name:
                  Platform.OS === 'android' && mediaType !== 'video'
                    ? item.fileName
                    : name,
                type:
                  Platform.OS === 'android' && mediaType !== 'video'
                    ? item.type
                    : type,
                uri:
                  Platform.OS === 'android'
                    ? item.uri
                    : item.uri.replace('file://', ''),
              };
              fileData.push(file)
            })
            this.props.sendMultipleMediaMessage(
              fileData,
              CometChat.MESSAGE_TYPE.IMAGE
            );
          }

        },
      );
    } catch (err) {
      this.sheetRef?.current?.close();
      this.props.close();
    }
  };

  launchVideoLibrary = async mediaType => {
    try {
      launchImageLibrary(
        {
          mediaType: mediaType,
          includeBase64: false,
          cameraType: 'back',
          selectionLimit: 10,
        },
        response => {
          this.sheetRef?.current?.close();
          this.props.close();
          if (response.didCancel) {
            return null;
          }
          if (response.assets.length !== 0) {
            let fileData = []
            response.assets.forEach((item, index) => {
              let type = null;
              let name = null;
              if (
                Platform.OS === 'ios' &&
                item.fileName !== undefined
              ) {
                name = item.fileName;
                type = item.type;
              } else {
                type = item.type;
                name = 'Camera_001.jpeg';
              }
              if (mediaType === 'video') {
                type = 'video/quicktime';
                name = 'Camera_002.mov';
              }
              const file = {
                name: name,
                type:
                  Platform.OS === 'android' && mediaType !== 'video'
                    ? response.assets[0].type
                    : type,
                uri:
                  Platform.OS === 'android'
                    ? response.assets[index].uri
                    : response.assets[index].uri.replace('file://', ''),
              };
              fileData.push(file)
            })

            fileData.forEach((item, index) => {
              setTimeout(() => {
                this.props.sendMediaMessage(
                  item,
                  CometChat.MESSAGE_TYPE.VIDEO
                );
              }, index * 1000)
            })

          }

        },
      );
    } catch (err) {
      this.sheetRef?.current?.close();
      this.props.close();
    }
  };

  pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      if (res.length !== 0) {
        res.forEach((item, index) => {
          setTimeout(() => {
            const file = {
              name: item.name,
              type: item.type,
              uri: item.uri,
            };
            this.props.sendMediaMessage(file, CometChat.MESSAGE_TYPE.FILE);
          }, index * 1000)
        })
        this.sheetRef?.current?.close();
        this.props.close();
      } else {
        this.sheetRef?.current?.close();
        this.props.close();
      }

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.props.close();
        this.sheetRef?.current?.close();
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  renderContent = () => {
    let takePhotoBtn = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={() => this.onRequestPremission()}>
        <EvilIcon name="camera" size={24} color={theme.color.secoundry} />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Take Photo
        </Text>
      </TouchableOpacity>
    );
    let takeVideoBtn = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={() => this.onRequestPremission('video')}>
        <IonIcon
          name="videocam-outline"
          size={24}
          color={theme.color.secoundry}
        />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Take Video
        </Text>
      </TouchableOpacity>
    );
    let avp = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={() => this.launchLibrary('photo')}>
        <IonIcon name="image-outline" size={24} color={theme.color.secoundry} />

        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Photo Library
        </Text>
      </TouchableOpacity>
    );
    let vp = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={() => this.launchVideoLibrary('video')}>
        <IonIcon
          name="videocam-outline"
          size={24}
          color={theme.color.secoundry}
        />

        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Video Library
        </Text>
      </TouchableOpacity>
    );
    let docs = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={this.pickDocument}>
        <IonIcon
          name="ios-folder-outline"
          size={24}
          color={theme.color.secoundry}
        />

        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Document
        </Text>
      </TouchableOpacity>
    );

    let stickerBtn = (
      <TouchableOpacity style={style.actionButtonContainer}>
        <MCIIcon
          name="sticker-circle-outline"
          size={24}
          color={theme.color.secoundry}
        />

        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}
          onPress={() => this.props.toggleStickers()}>
          Send Sticker
        </Text>
      </TouchableOpacity>
    );

    let createPollBtn = (
      <TouchableOpacity
        style={style.actionButtonContainer}
        onPress={() => {
          this.props.toggleCreatePoll();
        }}>
        <MCIIcon name="comment-plus-outline" size={24} />

        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            fontWeight: '500',
            color: theme.color.secoundry,
          }}>
          Create Poll
        </Text>
      </TouchableOpacity>
    );
    if (!this.state.restrictions?.isPollsEnabled) {
      createPollBtn = null;
    }
    if (!this.state.restrictions?.isStickersEnabled) {
      // stickerBtn = null;
    }
    if (!this.state.restrictions?.isFilesEnabled) {
      // docs = null;
    }
    if (!this.state.restrictions?.isPhotosVideosEnabled) {
      // takeVideoBtn = null;
      // avp = null;
      // takePhotoBtn = null;
      // vp = null;
    }
    return (
      <View style={style.reactionDetailsContainer}>
        {takePhotoBtn}
        {takeVideoBtn}
        {avp}
        {vp}
        {docs}
        {stickerBtn}
        {createPollBtn}
      </View>
    );
  };

  renderHeader = () => <View style={style.header} />;

  render() {
    const { visible, close } = this.props;
    return (
      <Modal
        transparent
        animated
        animationType="fade"
        visible={visible}
        onRequestClose={() => {
          this.sheetRef?.current?.close();
          this.props.close();
        }}>
        <View style={style.bottomSheetContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.sheetRef?.current?.close();
              this.props.close();
            }}>
            <View style={style.fullFlex}>
              {this.state.snapPoints ? (
                <RBSheet
                  ref={this.sheetRef}
                  closeOnDragDown={true}
                  height={350 * heightRatio}
                  onClose={() => {
                    this.sheetRef?.current?.close();
                    this.props.close();
                  }}
                  customStyles={{
                    container: {
                      borderColor: colors.shadow,
                      borderWidth: 1,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                    },
                    wrapper: {
                      // backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                    draggableIcon: {
                      width: 100,
                      // marginTop: 15,
                    },
                  }}>
                  {this.renderContent()}
                </RBSheet>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}
