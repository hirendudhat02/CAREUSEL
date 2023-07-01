import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Container, IconInfo, Text } from '../../components';
import InfoCard from '../../components/clinetdetails/InfoCard';
import { colors } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loaderAction } from '../../redux/Action/LoaderAction';
import {
  ProfileRequest,
  ProfileResponse,
} from '../../redux/Action/ProfileAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../helpers/loader';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import Regex from '../../utils/helper';
import FastImage from 'react-native-fast-image';
import theme from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/resources/theme';
import * as enums from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/enums';
import { CometChat } from '@cometchat-pro/react-native-chat';
import * as actions from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/actions';
import CometChatManager from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/controller';
import Toast from '../../utils/toast';
const clientProfile = memo(props => {
  const dispetch = useDispatch();
  const [personalData, setPersonalData] = useState({});
  const [userID, setUseId] = useState('');
  const OpenEmailAddrss = async email => {
    Linking.openURL(`mailto:${email}`);
  };
  const profileResponse = useSelector(state => state.profile);
  const laderResponse = useSelector(state => state.loader);
  useMemo(() => {
    setPersonalData({});
    if (props.route.params.data !== undefined) {
      const unsubscribe = props.navigation.addListener('focus', () => {
        AsyncStorage.getItem('userdata').then(Data => {
          let UserData = JSON.parse(Data);
          let ProfileID = props.route.params.data;

          var userId = '';
          if (props.route.params.navigate === 'invite') {
            userId = ProfileID._id;
          } else {
            userId = ProfileID.userId;
          }
          setUseId(userId);
          let payload = {
            userId: userId,
            token: UserData.accessToken[0],
          };

          dispetch(loaderAction(true));
          dispetch(ProfileRequest(payload, props.navigation));
        });
      });
      return unsubscribe;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.navigation]);

  useMemo(() => {
    if (profileResponse.data !== null) {
      setPersonalData(profileResponse.data?.data);
      dispetch(ProfileResponse(null));
    }
  }, [profileResponse]);

  /**
   * Handles actions sent from lower level components
   * @param action: action names
   * @param item: item to be updated
   * @param count
   */

  const actionHandler = (action, item, count) => {
    switch (action) {
      case actions.BLOCK_USER:
        this.blockUser();
        break;
      case actions.UNBLOCK_USER:
        this.unblockUser();
        break;
      case actions.AUDIO_CALL:
        this.audioCall();
        break;
      case actions.VIDEO_CALL:
        this.videoCall();
        break;
      case actions.VIEW_DETAIL:
      case actions.CLOSE_DETAIL_CLICKED:
        this.toggleDetailView();
        break;
      case actions.MENU_CLICKED:
        this.toggleSideBar();
        this.setState({ item: {} });
        break;
      case actions.VIEW_MESSAGE_THREAD:
        break;
      case actions.CLOSE_THREAD_CLICKED:
        this.closeThreadMessages();
        break;
      case actions.THREAD_MESSAGE_COMPOSED:
        break;
      case actions.ACCEPT_INCOMING_CALL:
        this.acceptIncomingCall(item);
        break;
      case actions.ACCEPTED_INCOMING_CALL:
        this.callInitiated(item);
        break;
      case actions.REJECTED_INCOMING_CALL:
        this.rejectedIncomingCall(item, count);
        break;
      case actions.OUTGOING_CALL_REJECTED:
      case actions.OUTGOING_CALL_CANCELLED:
      case actions.CALL_ENDED:
        this.outgoingCallEnded(item);
        break;
      case actions.USER_JOINED_CALL:
      case actions.USER_LEFT_CALL:
        break;
      case actions.VIEW_ACTUAL_IMAGE:
        this.toggleImageView(item);
        break;
      default:
        break;
    }
  };

  const massagenavigateToScreen = async item => {
    dispetch(loaderAction(true));
    let SenderData = null;
    let UserData = null;

    await CometChat.getUser(item).then(user => {
      SenderData = user;
    }).catch(() => {
      dispetch(loaderAction(false));
    });

    await new CometChatManager().getLoggedInUser().then(user => {
      UserData = user;
    }).catch(() => {
      dispetch(loaderAction(false));
    });
    if (SenderData !== null && UserData !== null) {
      props.navigation.push(enums.NAVIGATION_CONSTANTS.COMET_CHAT_MESSAGES, {
        theme: theme,
        item: { ...SenderData },
        tab: 'conversations',
        type: CometChat.RECEIVER_TYPE.USER,
        loggedInUser: UserData,
        actionGenerated: actionHandler,
      });
    } else {
      Toast.show('User Not Found', 'danger');
      dispetch(loaderAction(false));
    }
    dispetch(loaderAction(false));
  };

  const handleClick = url => {
    Linking.openURL(url);
  };
  const navigateToScreen = useCallback(() => {
    props.navigation.goBack('');
  }, []);

  return (
    <View style={{ flexGrow: 1 }}>
      <Container
        title={
          personalData.firstName
            ? personalData.firstName + '’s Profile'
            : 'Profile'
        }
        iconLeft={'Back'}
        onIconLeftPress={() => navigateToScreen()}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}>
          <View style={styles.container}>
            <View style={styles.profileview}>
              <View style={styles.profileimage}>
                <FastImage
                  source={
                    personalData.profilePicUrl === undefined ||
                      !Regex.validateURL(personalData.profilePicUrl)
                      ? images.defaultphoto
                      : { uri: personalData.profilePicUrl }
                  }
                  style={styles.chat_avatar}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 60 }}>
              {personalData.firstName && personalData.lastName && (
                <Text isBold style={styles.title}>
                  {personalData.prefix !== null &&
                    personalData.prefix !== undefined &&
                    personalData.prefix}{' '}
                  {personalData.firstName + ' ' + personalData.lastName}
                </Text>
              )}
              <View style={{ marginTop: 10, alignItems: 'center', width: '90%' }}>
                {personalData.userType === 'expert'
                  ? personalData.registeringAs && (
                    <IconInfo
                      disabled={true}
                      icon="suitcase"
                      label={personalData.registeringAs}
                    />
                  )
                  : personalData.email && (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        OpenEmailAddrss(personalData.email);
                      }}>
                      <IconInfo
                        disabled={true}
                        icon="mailicon"
                        label={personalData.email}
                      />
                    </TouchableOpacity>
                  )}
                {personalData.address && (
                  <IconInfo
                    disabled={true}
                    icon="location"
                    label={personalData.address.trim()}
                  />
                )}
                {personalData.phoneNumber && (
                  <IconInfo
                    disabled={true}
                    icon="callicon"
                    label={'+1' + personalData.phoneNumber}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}>
                  {personalData.instaLink && (
                    <IconInfo
                      disabled={false}
                      onPress={() => {
                        handleClick(personalData.instaLink);
                      }}
                      icon="orignalinstagram"
                      iconsize={30}
                      height={30}
                    />
                  )}
                  {personalData.facebookLink && (
                    <View style={{ paddingLeft: 20 }}>
                      <IconInfo
                        disabled={false}
                        onPress={() => {
                          handleClick(personalData.facebookLink);
                        }}
                        icon="orignalfacebook"
                        iconsize={30}
                        height={30}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            {Object.keys(personalData).length !== 0 &&
              props.route.params.navigate !== 'invite' &&
              props.route.params.navigate !== 'ChatProfile' ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Button
                  onPress={() => {
                    massagenavigateToScreen(userID);
                  }}
                  label={'Message'}
                />
              </View>
            ) : null}

            {Object.keys(personalData).length !== 0 ? (
              <InfoCard
                data={personalData}
                cardtype={personalData.userType !== 'expert' ? 'profile' : null}
              />
            ) : null}
            {Object.keys(personalData).length !== 0 ? (
              <InfoCard
                data={personalData}
                showpactice={personalData.userType === 'expert' ? true : false}
                aboutText={
                  personalData.userType === 'expert'
                    ? 'Focuses'
                    : 'What I’m Here For'
                }
                cardtype="About"
                profiletype={'About Me'}
              />
            ) : null}
          </View>
        </ScrollView>
      </Container>
      <Loader value={laderResponse.loader} />
    </View>
  );
});

export default clientProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  profileview: {
    backgroundColor: colors.primary,
    height: 120,
  },
  profileimage: {
    alignSelf: 'center',
    bottom: -50,
    position: 'absolute',
  },
  chat_avatar: {
    height: 125,
    width: 125,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.white,
    elevation: 5,
    shadowColor: colors.black,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '500',
    color: colors.charcoal,
  },
});
