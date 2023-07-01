import React, {
  memo,
  // useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Icon, Input, Text, Watermark } from '../../components';
import { colors } from '../../theme';
import PeopleCard from './components/PeopleCard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loaderAction } from '../../redux/Action/LoaderAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../helpers/loader';
import {
  ClientCircleRequest,
  ClientCircleResponse,
} from '../../redux/Action/ClientCircleAction';
import { images } from '../../assets';
import { moderateScale, scale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import Constant from '../../helpers/Constant';
import { ClientRefreshAction } from '../../redux/Action/ClientRefresh';
import { useCallback } from 'react';
import { CometChat } from '@cometchat-pro/react-native-chat';
import theme from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/resources/theme';
import * as enums from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/enums';
import * as actions from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/actions';
import CometChatManager from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/controller';
import Toast from '../../utils/toast';
import { COMETCHAT_CONSTANTS } from '../../CONSTS';
const ClientScreen = memo(props => {
  const [data, serData] = useState([]);
  const [search, setSearch] = useState('');
  const [top, setTop] = useState(false);
  const [atoZ, setAtoz] = useState(false);
  const [ztoA, setZtoa] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [shortType, setShortType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const dispetch = useDispatch();
  const refRBSheet = useRef();

  const laderResponse = useSelector(state => state.loader);
  const clientCircaleResponse = useSelector(state => state.clienrcircle);
  const clientrefreshResponse = useSelector(state => state.clientrefresh);

  useEffect(() => {
    if (
      clientrefreshResponse.loader !== null &&
      clientrefreshResponse.loader !== undefined
    ) {
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          setLoader(false);
          serData([]);
          setLoadMore(false);
          setPage(1);
          setTop(false);
          setAtoz(false);
          setZtoa(false);
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          let payload = {
            currentUserId: UserData._id,
            userType: 'client',
            limit: 30,
            pageNo: 1,
            sortOrder: shortType,
            searchQuery: search,
          };
          dispetch(loaderAction(true));
          dispetch(ClientCircleRequest(payload, tokenData, props.navigation));
        }
      });
      dispetch(ClientRefreshAction(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientrefreshResponse]);

  useEffect(() => {
    if (clientCircaleResponse.data !== undefined) {
      if (clientCircaleResponse.data !== null) {
        let Apidata = clientCircaleResponse.data?.data.userList ?? [];
        if (Apidata?.length === 30) {
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
        if (Apidata.length !== 0) {
          const newData = [...data];
          var newArray = newData.concat(Apidata);
          serData(newArray);
        }
        dispetch(ClientCircleResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCircaleResponse]);

  useEffect(() => {
    try {
      if (page === 1) {
        if (data.length !== 0) {
          onRegisterCometchat();
        }
      }
    } catch (error) {
      console.log("error:", error)
    }
  }, [data])

  const onRegisterCometchat = async () => {
    await new CometChatManager()
      .getLoggedInUser()
      .then(user => {
        if (user === null) {
          AsyncStorage.getItem('userdata').then(Data => {
            if (Data !== null) {
              let UserData = JSON.parse(Data);
              let username = UserData?.firstName + " " + UserData?.lastName
              let Cometuser = new CometChat.User(UserData._id);
              Cometuser.setName(username);
              Cometuser.setStatus('online');
              CometChat.createUser(Cometuser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                user => {
                  try {
                    if (user) {
                      onCometAuthLogin(UserData?._id);
                    }
                  } catch (error) {
                    console.log("error::", error)
                    // dispetch(loaderAction(false));
                  }
                },
              ).catch((error) => {
                // dispetch(loaderAction(false));
              });
            }
          });
        }
      })
      .catch(error => {
        console.log('error:::', error);
        // dispetch(loaderAction(false));
      });
  }


  var appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .build();

  const onCometAuthLogin = async uid => {
    let checkToken = await AsyncStorage.getItem('fcmToken');
    CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting)
      .then(() => {
        if (CometChat.setSource) {
          CometChat.setSource('ui-kit', Platform.OS, 'react-native');
        }
        CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY)
          .then(user => {
            if (user) {
              CometChat.registerTokenForPushNotification(checkToken);
            }
          })
          .catch(error => {
            // alert(error?.code)
          });
      })
      .catch(() => {
        // dispetch(loaderAction(false));
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          setUserID(UserData._id);
          setToken(tokenData);
          // refreshApi();
          setLoader(false);
        }
      });
    });
    return unsubscribe;
  }, [props.navigation]);

  const refreshApi = clear => {
    Keyboard.dismiss();
    setLoadMore(false);
    setPage(1);
    setLoader(false);
    setTop(false);
    setAtoz(false);
    setZtoa(false);
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        let payload = {
          currentUserId: UserData._id,
          userType: 'client',
          limit: 30,
          pageNo: 1,
          sortOrder: shortType,
          searchQuery: clear === 'clear' ? '' : search,
        };
        dispetch(loaderAction(true));
        serData([]);
        dispetch(ClientCircleRequest(payload, tokenData, props.navigation));
      }
    });
  };

  const onRefreshApi = () => {
    setSearch('');
    setLoader(false);
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        setLoadMore(false);
        setPage(1);
        serData([]);
        let payload = {
          currentUserId: UserData._id,
          userType: 'client',
          limit: 30,
          pageNo: 1,
          sortOrder: shortType,
          searchQuery: search,
        };
        dispetch(ClientCircleRequest(payload, tokenData, props.navigation));
      }
    });
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefreshApi();
    wait(1500).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterData = () => {
    setLoader(false);
    refRBSheet.current.close();
    setLoadMore(false);
    setPage(1);
    serData([]);

    let payload = {
      currentUserId: userID,
      userType: 'client',
      sortOrder: '',
      limit: 30,
      pageNo: 1,
      searchQuery: search,
    };
    if (top === true) {
      payload.sortOrder = 'none';
      setShortType('none');
    } else if (atoZ === true) {
      payload.sortOrder = 'AtoZ';
      setShortType('AtoZ');
    } else {
      payload.sortOrder = 'ZtoA';
      setShortType('ZtoA');
    }
    setTimeout(() => {
      dispetch(loaderAction(true));
      dispetch(ClientCircleRequest(payload, token, props.navigation));
    }, 500);
  };

  const clearData = () => {
    setLoader(false);
    setShortType('');
    setTop(false);
    setAtoz(false);
    setZtoa(false);
    refreshApi();
    refRBSheet.current.close();
  };
  const onPaginationCalled = pageIncr => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        userType: 'client',
        limit: 30,
        pageNo: page + 1,
        sortOrder: shortType,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(ClientCircleRequest(payload, token, props.navigation));
    }
  };
  const navigateToScreen = useCallback(item => {
    props.navigation.navigate('clientProfile', {
      data: item,
      screen: 'Client Profile',
    });
  }, []);

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

  const chatnavigateToScreen = async item => {
    dispetch(loaderAction(true));
    let SenderData = null;
    let UserData = null;

    await CometChat.getUser(item.userId).then(user => {
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
    }
    dispetch(loaderAction(false));
  };

  const renderItem = ({ item, index }) => {
    return (
      <PeopleCard
        key={'client'}
        index={index}
        item={item}
        profilonPress={() => navigateToScreen(item)}
        chatonPress={() => chatnavigateToScreen(item)}
      />
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    searchfunc(debouncedQuery);
  }, [debouncedQuery]);

  const searchfunc = async searchText => {
    try {
      setLoadMore(false);
      serData([]);
      setPage(1);
      let payload = {
        currentUserId: userID,
        userType: 'client',
        sortOrder: shortType,
        limit: 30,
        pageNo: 1,
        searchQuery: searchText,
      };
      setLoader(true);
      await fetch(Constant.baseURL + Constant.end_Point.MYCIRCALE, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(result => {
          let Apidata = result.data.userList;
          if (Apidata?.length === 30) {
            setLoadMore(true);
          } else {
            setLoadMore(false);
          }
          if (Apidata.length !== 0) {
            serData(Apidata);
          }
          setLoader(false);
        })
        .catch(e => {
          console.log(e);

          setLoader(false);
        });
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  const ListEmptyComponent = () => {
    return (
      <View style={styles.emptyview}>
        {!laderResponse.loader && (
          <>
            <FastImage source={images.nodata} style={styles.emptyimage} />
            {search.length !== 0 ? (
              <Text isSemiBold style={styles.emptydata}>
                No Connections Found!
              </Text>
            ) : (
              <Text isSemiBold style={styles.emptydata}>
                Looks like you have not connected with any friends yet. Send
                invites to your friends so that they can get added to your
                Friend Circle.
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Watermark />
        <View style={styles.searchContainer}>
          <View style={{ width: '85%' }}>
            <Input
              onSubmitEditing={() => refreshApi()}
              onIconPress={() => {
                setSearch('');
                let clear = 'clear';
                refreshApi(clear);
              }}
              placeholder="Search"
              icon={search !== '' ? 'close' : 'searchwhite'}
              value={search}
              onChangeText={txt => setSearch(txt)}
            />
          </View>
          <Icon
            onPress={() => refRBSheet.current.open()}
            name={'Filter'}
            style={styles.chatIcon}
            height={45}
            size={45}
          />
        </View>

        <FlatList
          key={'client'}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
          ListEmptyComponent={<ListEmptyComponent />}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={({ data }) => onPaginationCalled()}
        />
        <Bottomsheet
          refRBSheet={refRBSheet}
          toponpress={() => {
            setTop(top === true ? false : true);
            setAtoz(false);
            setZtoa(false);
          }}
          top={top}
          atoZonpress={() => {
            setAtoz(atoZ === true ? false : true);
            setZtoa(false);
            setTop(false);
          }}
          atoZ={atoZ}
          ztoAonpress={() => {
            setZtoa(ztoA === true ? false : true);
            setAtoz(false);
            setTop(false);
          }}
          ztoA={ztoA}
          disabled={(ztoA || atoZ || top) === true ? false : true}
          doneonpress={() => {
            filterData();
          }}
          clearonpress={() => {
            clearData();
          }}
        />
        <Loader value={laderResponse.loader} />
      </View>
    </>
  );
});

export default ClientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  separator: {
    padding: 10,
  },
  customScrollBar: {
    backgroundColor: colors.grayMedium,
    borderRadius: 3,
    width: 6,
  },
  customScrollBarBackground: {
    backgroundColor: colors.gray,
    borderRadius: 3,
    height: '100%',
    width: 6,
  },
  scrollContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  emptydata: { textAlign: 'center', fontSize: moderateScale(17) },
  emptyview: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 20,
    top: moderateScale(-15),
  },
  emptyimage: {
    height: moderateScale(160),
    width: moderateScale(160),
    marginBottom: moderateScale(20),
  },
});
