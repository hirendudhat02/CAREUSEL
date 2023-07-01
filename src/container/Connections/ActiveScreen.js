import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { Icon, Input, Text, Watermark } from '../../components';
import { colors } from '../../theme';
import ActiveCard from './components/ActiveCard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import AppModal from '../../components/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { loaderAction } from '../../redux/Action/LoaderAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../helpers/loader';
import {
  ActiveStatusRequest,
  ActiveStatusResponse,
} from '../../redux/Action/ActiveStatusAction';
import { ActiveRequest, ActiveResponse } from '../../redux/Action/ActiveAction';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import { ActionFilterAction } from '../../redux/Action/ActionFilter';
import { RejectFilterAction } from '../../redux/Action/RejectFilter';
import Constant from '../../helpers/Constant';
import CometChatManager from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/utils/controller';
import { COMETCHAT_CONSTANTS } from '../../CONSTS';
import { CometChat } from '@cometchat-pro/react-native-chat';
const ActiveScreen = memo(({ navigation }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [top, setTop] = useState(false);
  const [atoZ, setAtoz] = useState(false);
  const [ztoA, setZtoa] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const refRBSheet = useRef();
  const [userID, setUserID] = useState('');
  const [deleteID, setDeleteID] = useState('');
  const [token, setToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [shortType, setShortType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const ActiveDataResponse = useSelector(state => state.active);
  const ActionStatusResponse = useSelector(state => state.activestatus);
  const ActiveFilterResponse = useSelector(state => state.activefilter);

  useEffect(() => {
    if (
      ActiveFilterResponse?.filter !== null &&
      ActiveFilterResponse?.filter !== undefined
    ) {
      setFilterType(ActiveFilterResponse.filter);
      setLoadMore(false);
      setPage(1);
      setTop(false);
      setAtoz(false);
      setZtoa(false);
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          let payload = {
            currentUserId: UserData._id,
            action: 'active',
            userType: ActiveFilterResponse.filter,
            limit: 30,
            pageNo: 1,
            sortOrder: shortType,
            searchQuery: search,
          };
          dispetch(loaderAction(true));
          setData([]);
          dispetch(ActiveRequest(payload, tokenData, navigation));
        }
      });
      dispetch(ActionFilterAction(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActiveFilterResponse]);

  useEffect(() => {
    setLoadMore(false);
    setPage(1);
    setData([]);
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          setUserID(UserData._id);
          setToken(tokenData);
        }
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (ActionStatusResponse.data !== undefined) {
      if (ActionStatusResponse.data !== null) {
        setSuccessModalOpen(true);
        setModalOpen(true);
        refreshApi();
        dispetch(RejectFilterAction(filterType));
        dispetch(ActiveStatusResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActionStatusResponse]);

  const onRefreshApi = () => {
    setLoadMore(false);
    setPage(1);
    setData([]);
    setSearch('');
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        let payload = {
          currentUserId: UserData._id,
          action: 'active',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: search,
        };
        dispetch(ActiveRequest(payload, tokenData, navigation));
      }
    });
  };

  const refreshApi = clear => {
    setLoadMore(false);
    setPage(1);
    setData([]);
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        let payload = {
          currentUserId: UserData._id,
          action: 'active',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: clear === 'clear' ? '' : search,
        };
        dispetch(loaderAction(true));
        dispetch(ActiveRequest(payload, tokenData, navigation));
      }
    });
  };

  useMemo(() => {
    if (ActiveDataResponse.data !== undefined) {
      if (ActiveDataResponse.data !== null) {
        let Apidata = ActiveDataResponse.data?.data.userList ?? [];

        if (Apidata?.length === 30) {
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
        if (Apidata.length !== 0) {
          const newData = [...data];
          var newArray = newData.concat(Apidata);
          setData(newArray);
        }
        dispetch(ActiveResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActiveDataResponse.data]);

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
    refRBSheet.current.close();
    setLoadMore(false);
    setPage(1);
    setData([]);
    let payload = {
      currentUserId: userID,
      action: 'active',
      sortOrder: '',
      limit: 30,
      pageNo: 1,
      userType: filterType,
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
      dispetch(ActiveRequest(payload, token, navigation));
    }, 500);
  };

  const clearData = () => {
    setTop(false);
    setAtoz(false);
    setZtoa(false);
    setShortType('');
    refreshApi();
    refRBSheet.current.close();
  };

  const onDelete = () => {
    setModalOpen(false);
    setTimeout(() => {
      let payload = {
        currentUserId: userID,
        action: 'rejected',
        id: deleteID,
      };
      dispetch(loaderAction(true));
      dispetch(ActiveStatusRequest(payload, token, navigation));
    }, 500);
  };

  const onPaginationCalled = pageIncr => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        action: 'active',
        limit: 30,
        pageNo: page + 1,
        userType: filterType,
        sortOrder: shortType,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(ActiveRequest(payload, token, navigation));
    }
  };
  // const navigateToScreen = useCallback(item => {
  //   navigation.navigate('clientProfile', {
  //     data: item,
  //     screen: 'Client Profile',
  //     navigate: 'invite',
  //   });
  // }, []);

  const renderItem = ({ item, index }) => {
    return (
      <ActiveCard
        item={item}
        index={index}
        // onProfilePress={() => navigateToScreen(item)}
        deleteonPress={() => {
          setDeleteID(item?._id);
          setModalOpen(true);
          setSuccessModalOpen(false);
        }}
      />
    );
  };

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
                      dispetch(loaderAction(false));
                      onCometAuthLogin(UserData?._id);
                    }
                  } catch (error) {
                    console.log("error::", error)
                    dispetch(loaderAction(false));
                  }
                },
              ).catch((error) => {
                dispetch(loaderAction(false));
              });
            }
          });
        }
      })
      .catch(error => {
        console.log('error:::', error);
        dispetch(loaderAction(false));
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
              dispetch(loaderAction(false));
            }
          })
          .catch(error => {
            // alert(error?.code)
            dispetch(loaderAction(false));
          });
      })
      .catch(() => {
        dispetch(loaderAction(false));
      });
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
      setData([]);
      setPage(1);
      let payload = {
        currentUserId: userID,
        action: 'active',
        limit: 30,
        pageNo: 1,
        userType: filterType,
        sortOrder: shortType,
        searchQuery: searchText,
      };
      await fetch(Constant.baseURL + Constant.end_Point.CONNECTION, {
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
            setData(Apidata);
          }
        })
        .catch(e => {
          console.log(e);
        });
    } catch (err) {
      console.log(err);
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
                You have no active connections yet.
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
            name={'Filter'}
            onPress={() => refRBSheet.current.open()}
            style={styles.chatIcon}
            height={45}
            size={45}
          />
        </View>
        <FlatList
          data={data}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyComponent />}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onEndReached={({ data }) => onPaginationCalled()}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
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
          doneonpress={() => {
            filterData();
          }}
          clearonpress={() => {
            clearData();
          }}
        />
        <AppModal
          isVisible={modalOpen}
          modalTitle={'Remove Connection'}
          savelable="Yes, Remove"
          canclelable="Cancel"
          modalStyle={successModalOpen === true ? 'success' : ''}
          details={
            successModalOpen === true
              ? 'Connection has been removed successfully. You can reactivate this connection at any time by sending a new invitation. Please note, this action only ends your connection to this Expert on Careusel, you may still need to contact the Expert directly to terminate any treatment or billing plans outside of Careusel.'
              : 'Are you sure you want to remove this connection? Removed connections will no longer appear in your My Circle. You will be able to view your historical conversation, but unable to send new messages'
          }
          onBackdropPress={() => {
            setModalOpen(false);
          }}
          onBackButtonPress={() => {
            setModalOpen(false);
          }}
          onPressClose={() => {
            setModalOpen(false);
          }}
          onPressOk={() => {
            setModalOpen(false);
          }}
          onPressCancle={() => {
            setModalOpen(false);
          }}
          onPressSave={() => {
            onDelete();
          }}
        />
        <Loader value={laderResponse.loader} />
      </View>
    </>
  );
});

export default ActiveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    padding: 10,
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
