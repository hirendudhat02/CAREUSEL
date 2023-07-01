import { FlatList, Platform, StyleSheet, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Input, Text, Watermark } from '../../components';
import { colors } from '../../theme';
import InviteCard from './components/InviteCard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import AppModal from '../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loaderAction } from '../../redux/Action/LoaderAction';
import FastImage from 'react-native-fast-image';
import Loader from '../../helpers/loader';
import {
  InvitesRequest,
  InvitesResponse,
} from '../../redux/Action/InvitesAction';
import {
  InvitesStatusRequest,
  InvitesStatusResponse,
} from '../../redux/Action/InvitesStatusAction';
import {
  InvitesAcceptRequest,
  InvitesAcceptResponse,
} from '../../redux/Action/InvitesAcceptAction';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import { ReceivedFilterAction } from '../../redux/Action/ReceivedFilter';
import { ActionFilterAction } from '../../redux/Action/ActionFilter';
import Constant from '../../helpers/Constant';
import { ConversationRequest } from '../../redux/Action/ConversationListAction';
import { ConnectionBadgeResponse } from '../../redux/Action/ConnectionBadgeAction';

const InvitesScreen = memo(({ navigation }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [top, setTop] = useState(false);
  const [atoZ, setAtoz] = useState(false);
  const [ztoA, setZtoa] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalApproveOpen, setModalApproveOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApproveOpen, setSuccessApproveOpen] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [deleteID, setDeleteID] = useState('');
  const [acceptID, setAcceptID] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectName, setSelectName] = useState('');
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [shortType, setShortType] = useState('');
  const [selectProffession, setSelectProffesion] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispetch = useDispatch();
  const refRBSheet = useRef();
  const laderResponse = useSelector(state => state.loader);
  const InvitesDataResponse = useSelector(state => state.invites);
  const invitesStatusResponse = useSelector(state => state.invitesstatus);
  const invitesAcceptResponse = useSelector(state => state.invitesaccept);
  const ReceivedFilterResponse = useSelector(state => state.receivedfilter);

  useEffect(() => {
    if (
      ReceivedFilterResponse.filter !== null &&
      ReceivedFilterResponse.filter !== undefined
    ) {
      setFilterType(ReceivedFilterResponse.filter);
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
            action: 'invites',
            userType: ReceivedFilterResponse.filter,
            limit: 30,
            pageNo: 1,
            sortOrder: shortType,
            searchQuery: search,
          };
          dispetch(loaderAction(true));
          setData([]);
          dispetch(InvitesRequest(payload, tokenData, navigation));
        }
      });
      dispetch(ConnectionBadgeResponse(null));
      dispetch(ReceivedFilterAction(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReceivedFilterResponse]);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefreshApi();
    wait(1500).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoadMore(false);
    setPage(1);
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
  useMemo(() => {
    if (InvitesDataResponse.data !== null) {
      let Apidata = InvitesDataResponse.data?.data.userList ?? [];
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
      dispetch(InvitesResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InvitesDataResponse]);

  useEffect(() => {
    if (invitesStatusResponse.data !== undefined) {
      if (invitesStatusResponse.data !== null) {
        setSuccessModalOpen(true);
        setModalOpen(true);
        setTimeout(() => {
          refreshApi();
        }, 2000);
        dispetch(InvitesStatusResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitesStatusResponse]);

  useEffect(() => {
    if (invitesAcceptResponse.data !== undefined) {
      if (invitesAcceptResponse.data !== null) {
        setSuccessApproveOpen(true);
        setModalApproveOpen(true);
        refreshApi();
        dispetch(ActionFilterAction(filterType));
        dispetch(InvitesAcceptResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitesAcceptResponse]);

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
          action: 'invites',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: clear === 'clear' ? '' : search,
        };
        dispetch(loaderAction(true));
        dispetch(InvitesRequest(payload, tokenData, navigation));
      }
    });
    AsyncStorage.getItem('userdata').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let tokenData = UserData.accessToken[0];
        let payload = {
          currentUserId: UserData._id,
          action: 'active',
        };
        dispetch(ConversationRequest(payload, tokenData, navigation));
      }
    });
  };

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
          action: 'invites',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: search,
        };
        dispetch(InvitesRequest(payload, tokenData, navigation));
      }
    });
  };

  const filterData = () => {
    refRBSheet.current.close();
    setLoadMore(false);
    setPage(1);
    setData([]);
    let payload = {
      currentUserId: userID,
      action: 'invites',
      sortOrder: '',
      limit: 30,
      pageNo: 1,
      userType: filterType,
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
      dispetch(InvitesRequest(payload, token, navigation));
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
      dispetch(InvitesStatusRequest(payload, token, navigation));
    }, 500);
  };

  const onAccept = () => {
    setModalApproveOpen(false);
    setTimeout(() => {
      let payload = {
        currentUserId: userID,
        action: 'active',
        id: acceptID,
      };
      dispetch(loaderAction(true));
      dispetch(InvitesAcceptRequest(payload, token, navigation));
    }, 500);
  };

  const onPaginationCalled = pageIncr => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        action: 'invites',
        limit: 30,
        pageNo: page + 1,
        userType: filterType,
        sortOrder: shortType,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(InvitesRequest(payload, token, navigation));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <InviteCard
        item={item}
        index={index}
        tickOnpress={() => {
          setAcceptID(item._id);
          setModalApproveOpen(true);
          setSuccessApproveOpen(false);
          setSelectName(item.inviteeName);
          setSelectProffesion(item.invitedUserProfession);
        }}
        denideOnpress={() => {
          setDeleteID(item._id);
          setModalOpen(true);
          setSuccessModalOpen(false);
          setSelectName(item.inviteeName);
          setSelectProffesion(item.invitedUserProfession);
        }}
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
      setData([]);
      setPage(1);
      let payload = {
        currentUserId: userID,
        action: 'invites',
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
                You have not received any invites yet.
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
            onPress={() => refRBSheet.current.open()}
            name={'Filter'}
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        <AppModal
          isVisible={modalOpen}
          modalTitle={'Decline Invitation'}
          savelable="Confirm"
          canclelable="Cancel"
          modalStyle={successModalOpen === true ? 'success' : ''}
          details={
            successModalOpen === true
              ? `${selectName} invitation has been denied. If you change your mind, just ask them to resend the invite.`
              : `Please confirm you do not want to add ${selectName}, ${selectProffession} to your Circle at this time.`
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
            // setSuccessModalOpen(true);
          }}
        />
        <AppModal
          isVisible={modalApproveOpen}
          modalTitle={'Approve Connection'}
          savelable="Approve"
          canclelable="Cancel"
          modalStyle={successApproveOpen === true ? 'success' : ''}
          details={
            successApproveOpen === true
              ? `Congrats! ${selectName} has been added to your Circle.`
              : `Please confirm you would like to add ${selectName}, ${selectProffession} to your Circle.`
          }
          onBackdropPress={() => {
            setModalApproveOpen(false);
          }}
          onBackButtonPress={() => {
            setModalApproveOpen(false);
          }}
          onPressClose={() => {
            setModalApproveOpen(false);
          }}
          onPressCancle={() => {
            setModalApproveOpen(false);
          }}
          onPressSave={() => {
            onAccept();
          }}
          onPressOk={() => {
            setModalApproveOpen(false);
          }}
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
        <Loader value={laderResponse.loader} />
      </View>
    </>
  );
});

export default InvitesScreen;

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
