import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { Button, Container, Icon, IconInfo, Text } from '../../components';
import InfoCard from '../../components/clinetdetails/InfoCard';
import { colors } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AppModal from '../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { loaderAction } from '../../redux/Action/LoaderAction';
import { images } from '../../assets';
import { LogOutRequest } from '../../redux/Action/LogOutAction';
import { MyProfileRequest } from '../../redux/Action/MyProfileAction';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import Regex from '../../utils/helper';
import FirebasePushnotifiation from '../../service/FirebasePushnotifiation';
import Loader from '../../helpers/loader';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COMETCHAT_CONSTANTS } from '../../CONSTS';
const Profile = memo(props => {
  const [modalOpen, setModalOpen] = useState(false);
  const [personalData, setPersonalData] = useState({});
  const navigation = useNavigation();
  const dispetch = useDispatch();
  const profileResponse = useSelector(state => state.myprofile);
  const laderResponse = useSelector(state => state.loader);

  const scrolltop = useRef();

  useEffect(() => {
    const _firebasePushnotifiation = new FirebasePushnotifiation();
    setTimeout(() => {
      _firebasePushnotifiation.initFirebaseService(props.navigation);
    }, 1000);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      scrolltop.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      let payload = {
        userId: UserData._id,
        token: UserData.accessToken[0],
      };
      setPersonalData({})
      dispetch(loaderAction(true));
      dispetch(MyProfileRequest(payload, props.navigation));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useMemo(() => {
    if (profileResponse.data !== null) {
      setPersonalData(profileResponse.data?.data);
      let routdata = profileResponse.data?.data;
      CometChat.getLoggedinUser().then(userData => {
        if (userData.avatar !== profileResponse.data?.data.profilePicUrl) {
          if (Regex.validateURL(profileResponse.data?.data.profilePicUrl)) {
            let user = new CometChat.User(routdata?._id);
            user.setAvatar(routdata?.profilePicUrl);
            CometChat.updateUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
              user => {
                if (user) {
                  console.log('Updateuser::', user);
                } else {
                  console.log('Updateuser::', user);
                }
              },
              error => {
                console.log('Updateuser::', error);
              },
            );
          }
        }
      });
    }
  }, [profileResponse]);

  const onlogout = async () => {
    setModalOpen(false);
    CometChat.logout();
    // await messaging().deleteToken();
    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      console.log("userdata", UserData)
      setTimeout(() => {
        let payload = {
          userId: UserData._id,
        };
        dispetch(loaderAction(true));
        dispetch(LogOutRequest(payload, UserData?.accessToken[0], navigation));
      }, 500);
    });
  };

  const handleClick = url => {
    Linking.openURL(url);
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <Container title={'My Profile'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrolltop}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}>
          <View style={styles.container}>
            <View style={styles.profileview}>
              <View style={styles.profileimage}>
                <FastImage
                  source={
                    personalData.profilePicUrl !== undefined ||
                      Regex.validateURL(personalData.profilePicUrl)
                      ? { uri: personalData.profilePicUrl }
                      : images.defaultphoto
                  }
                  style={styles.chat_avatar}
                  resizeMode="cover"
                />
              </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              {personalData.firstName && personalData.lastName && (
                <Text isBold style={styles.title}>
                  {personalData?.firstName + ' ' + personalData?.lastName}
                </Text>
              )}

              <View
                style={{
                  marginTop: 10,
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}>
                {personalData.email && (
                  <IconInfo
                    disabled={true}
                    icon="mailicon"
                    label={personalData.email}
                  />
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
            {Object.keys(personalData).length !== 0 ? (
              <InfoCard data={personalData} cardtype="profile" />
            ) : null}

            {Object.keys(personalData).length !== 0 ? (
              <InfoCard
                data={personalData}
                showpactice={false}
                cardtype="About"
                profiletype="About Me"
                aboutText="What I’m Here For"
              />
            ) : null}
            <View style={{ marginHorizontal: 15, marginTop: 30 }}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('editProfile', { data: personalData })
                }
                style={[styles.opationview, { borderTopWidth: 1 }]}>
                <IconInfo
                  disabled={true}
                  iconsize={25}
                  icon="editprofile"
                  label={'Edit Profile'}
                  labelstyle={styles.lablestyle}
                />
                <Icon name="nextarrow" size={20} height={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.opationview}
                onPress={() => props.navigation.navigate('refer')}>
                <IconInfo
                  disabled={true}
                  iconsize={25}
                  icon="connectionrequest"
                  label={'Refer a User'}
                  labelstyle={styles.lablestyle}
                />
                <Icon name="nextarrow" size={20} height={18} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.opationview}
                onPress={() => props.navigation.navigate('changepassword')}>
                <IconInfo
                  disabled={true}
                  iconsize={25}
                  icon="changepassword"
                  label={'Change Password'}
                  labelstyle={styles.lablestyle}
                />
                <Icon name="nextarrow" size={20} height={18} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
              <Button
                isOutlined
                onPress={() => {
                  setModalOpen(true);
                }}
                label={'Logout'}
              />
            </View>
          </View>
        </ScrollView>
      </Container>
      <Loader value={laderResponse.loader} />
      <AppModal
        isVisible={modalOpen}
        modalTitle={'Confirm Logout'}
        savelable="Yes"
        canclelable="No"
        details={'Are you sure you want to logout?'}
        onBackdropPress={() => {
          setModalOpen(false);
        }}
        onBackButtonPress={() => {
          setModalOpen(false);
        }}
        onPressClose={() => {
          setModalOpen(false);
        }}
        onPressCancle={() => {
          setModalOpen(false);
        }}
        onPressSave={() => {
          onlogout();
        }}
      />
    </View>
  );
});

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    // backgroundColor: colors.white,
  },
  profileview: {
    backgroundColor: colors.primary,
    height: 120,
  },
  profileimage: {
    alignSelf: 'center',
    justifyContent: 'center',
    bottom: -50,
    position: 'absolute',
    shadowColor: colors.black,
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
  Push: { fontSize: 18, fontWeight: '500', color: colors.charcoal },
  lablestyle: {
    fontSize: moderateScale(18),
    color: colors.secoundry,
  },
  opationview: {
    // borderTopWidth: 1,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: colors.shadow,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  switchview: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 20,
  },
});
