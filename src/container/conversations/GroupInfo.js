import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, Icon, IconInfo, Text } from '../../components';
import { colors, fonts } from '../../theme';
import PeopleCard from './components/PeopleCard';
import { CometChatAvatar } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Shared';
import theme from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/resources/theme';
import CometChatManager from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/controller';
import { GroupDetailManager } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Groups/CometChatGroupDetails/controller';
import { heightRatio } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/consts';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import AppModal from '../../components/Modal';
import { CometChatContextProvider } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/CometChatContext';
import * as actions from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/actions';
import { CometChatGroupDetails } from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Groups';
const GroupInfo = props => {
  const { item } = props.route.params;
  const [data, setData] = useState([]);
  const [adminName, setAdmiName] = useState('');
  const [showSmallHeader, setShowSmallHeader] = useState(false);
  const [gropVisible, setGropVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  var decoratorMessage = 'Loading...';

  const renderItem = ({ item, index }) => {
    return (
      <PeopleCard
        item={item}
        index={index}
        cardtype={'member'}
        onPress={() => {
          props.navigation.navigate('clientProfile', {
            data: { userId: item.uid },
          });
        }}
      />
    );
  };
  useEffect(() => {
    getGroupMembers();
    new CometChatManager()
      .getLoggedInUser()
      .then(userData => {
        setLoggedInUser(userData);
      })
      .catch(error => {
        console.log(
          '[CometChatGroupListWithMessages] getLoggedInUser error',
          error,
        );
      });
  }, []);

  const getGroupMembers = () => {
    const moderatorsList = [];
    new CometChatManager()
      .getLoggedInUser()
      .then(user => {
        let loggedInUser = user;
        new GroupDetailManager(item?.guid)
          .fetchNextGroupMembers()
          .then(groupMembers => {
            groupMembers.forEach(member => {
              if (member.uid !== loggedInUser.uid) {
                moderatorsList.push(member);
              }
              if (member.scope === CometChat.GROUP_MEMBER_SCOPE.ADMIN) {
                setAdmiName(member.name);
              }
            });
            setData([...moderatorsList]);
            decoratorMessage = null;
          })
          .catch(error => {
            decoratorMessage = 'Error';
            console.log(
              '[CometChatGroupDetails] getGroupMembers fetchNextGroupMembers error',
              error,
            );
          });
      })
      .catch(error => {
        decoratorMessage = 'Error';
        console.log(
          '[CometChatGroupDetails] getGroupMembers getLoggedInUser error',
          error,
        );
      });
  };

  const handleScroll = nativeEvent => {
    try {
      if (nativeEvent.contentOffset.y > 35 && !showSmallHeader) {
        setShowSmallHeader(true);
      }
      if (nativeEvent.contentOffset.y <= 35 && showSmallHeader) {
        setShowSmallHeader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          overflow: 'hidden',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            margin: 0,
            height: 30 * heightRatio,
            fontSize: 24,
            fontWeight: '600',
          }}>
          {decoratorMessage}
        </Text>
      </View>
    );
  };

  const leaveGroup = () => {
    setModalOpen(false);
    try {
      const { guid } = item;
      CometChat.leaveGroup(guid)
        .then(response => {
          if (response) {
            setSuccessModalOpen(true);
            setModalOpen(true);
          } else {
          }
        })
        .catch(error => {
          console.log('Group leaving failed with exception:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const actionHandler = action => {
    switch (action) {
      case actions.CLOSE_DETAIL:
        setGropVisible(false);
        break;
      default:
        break;
    }
  };

  return (
    <CometChatContextProvider ref={el => (this.contextProviderRef = el)}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          enabled={true}
          style={{ flexGrow: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 120}>
          <Container
            iconLeft={'Back'}
            onIconLeftPress={() => props.navigation.goBack('')}>
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 15,
                    height: 120,
                    width: 120,
                    backgroundColor: 'rgba(51,153,255,0.25)',
                    borderRadius: 65,
                  }}>
                  <CometChatAvatar
                    image={{ uri: item.icon }}
                    cornerRadius={65}
                    borderColor={theme.color.grey}
                    borderWidth={2}
                    name={item.name}
                  />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text isBold style={styles.titletxt} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <IconInfo
                      iconsize={20}
                      icon="expert"
                      label={item.membersCount + ' Participants'}
                      disabled={true}
                      labelstyle={styles.labeltxt}
                    />
                  </View>
                  {adminName.length !== 0 && (
                    <Text style={styles.createtxt}>Created by {adminName}</Text>
                  )}
                </View>

                <View style={{ marginHorizontal: 5, marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setGropVisible(true);
                    }}
                    style={[styles.opationview, { borderTopWidth: 1 }]}>
                    <IconInfo
                      disabled={true}
                      vectorIcon={true}
                      iconsize={25}
                      icon="share-square-o"
                      label={'Shared Media'}
                      labelstyle={styles.lablestyle}
                    />
                    <Icon name="nextarrow" size={20} height={18} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.opationview}
                    onPress={() => setModalOpen(true)}>
                    <IconInfo
                      disabled={true}
                      iconsize={25}
                      vectorIcon={true}
                      icon="sign-out"
                      label={'Leave Group'}
                      labelstyle={styles.lablestyle}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ marginVertical: 15 }}>
                  <Text style={styles.participant}>Participants :</Text>
                </View>
                <FlatList
                  data={data}
                  onScroll={({ nativeEvent }) => {
                    handleScroll(nativeEvent);
                  }}
                  nestedScrollEnabled
                  contentContainerStyle={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<ListEmptyComponent />}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  onEndReached={() => {
                    getGroupMembers();
                  }}
                />
              </View>
            </ScrollView>
          </Container>
        </KeyboardAvoidingView>

        <AppModal
          isVisible={modalOpen}
          modalTitle={'Leave Group'}
          savelable="Yes, Leave"
          canclelable="Cancel"
          modalStyle={successModalOpen === true ? 'success' : ''}
          details={
            successModalOpen === true
              ? 'Group has been left successfully!'
              : 'Are you sure you want to leave this group ?'
          }
          onBackdropPress={() => {
            setModalOpen(false);
            setModalOpen(false);
            if (successModalOpen === true) {
              props.route.params.actionGenerated(actions.LEFT_GROUP, item);
            }
          }}
          onBackButtonPress={() => {
            setModalOpen(false);
            if (successModalOpen === true) {
              props.route.params.actionGenerated(actions.LEFT_GROUP, item);
            }
          }}
          onPressClose={() => {
            setModalOpen(false);
          }}
          onPressOk={() => {
            setModalOpen(false);
            props.route.params.actionGenerated(actions.LEFT_GROUP, item);
          }}
          onPressCancle={() => {
            setModalOpen(false);
          }}
          onPressSave={() => {
            leaveGroup();
          }}
        />
        {gropVisible ? (
          <CometChatGroupDetails
            theme={theme}
            open={gropVisible}
            item={item}
            type={CometChat.RECEIVER_TYPE.GROUP}
            actionGenerated={actionHandler}
            loggedInUser={loggedInUser}
          />
        ) : null}
      </View>
    </CometChatContextProvider>
  );
};

export default GroupInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileImg: {
    height: 150,
    width: 150,
    borderRadius: 150,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.shadow,
    elevation: 5,
  },
  titletxt: {
    fontSize: 22,
    paddingTop: 15,
  },
  labeltxt: {
    fontSize: 15,
  },
  createtxt: {
    fontSize: 16,
    paddingVertical: 5,
  },
  searchContainer: {
    paddingVertical: 15,
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
  lablestyle: {
    fontSize: moderateScale(16),
    color: colors.secoundry,
    fontFamily: fonts.SemiBold,
  },
  participant: {
    fontSize: moderateScale(16),
    color: colors.secoundry,
    fontWeight: '700',
    fontFamily: fonts.SemiBold,
  },
});
