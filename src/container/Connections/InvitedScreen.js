import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Input, Text, Watermark } from '../../components';
import { colors } from '../../theme';
import ActiveCard from './components/ActiveCard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import AppModal from '../../components/Modal';
import { loaderAction } from '../../redux/Action/LoaderAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../helpers/loader';
import {
  InvitedStatusRequest,
  InvitedStatusResponse,
} from '../../redux/Action/InvitedStatusAction';
import { SentRequest, SentResponse } from '../../redux/Action/SentAction';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import { FilterAction } from '../../redux/Action/FilterAction';
import Constant from '../../helpers/Constant';
const InvitedScreen = memo(({ navigation }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [top, setTop] = useState(false);
  const [atoZ, setAtoz] = useState(false);
  const [ztoA, setZtoa] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [deleteID, setDeleteID] = useState('');
  const [filterType, setFilterType] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [shortType, setShortType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispetch = useDispatch();
  const refRBSheet = useRef();

  const laderResponse = useSelector(state => state.loader);
  const sentResponse = useSelector(state => state.sent);
  const invitedStatusResponse = useSelector(state => state.invitedstatus);
  const FilterResponse = useSelector(state => state.filter);

  useEffect(() => {
    if (FilterResponse.filter !== null && FilterResponse.filter !== undefined) {
      setFilterType(FilterResponse.filter);
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
            action: 'invited',
            userType: FilterResponse.filter,
            limit: 30,
            pageNo: 1,
            searchQuery: search,
          };
          dispetch(loaderAction(true));
          setData([]);
          dispetch(SentRequest(payload, tokenData, navigation));
        }
      });
      dispetch(FilterAction(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FilterResponse]);

  useEffect(() => {
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

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefreshApi();
    wait(1500).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (sentResponse.data !== null) {
      let Apidata = sentResponse.data?.data.userList ?? [];

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
      dispetch(SentResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentResponse]);

  useEffect(() => {
    if (invitedStatusResponse.data !== null) {
      setSuccessModalOpen(true);
      setModalOpen(true);
      refreshApi();
      dispetch(InvitedStatusResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitedStatusResponse]);

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
          action: 'invited',
          userType: filterType,
          limit: 30,
          pageNo: 1,
          sortOrder: shortType,
          searchQuery: clear === 'clear' ? '' : search,
        };
        dispetch(loaderAction(true));
        dispetch(SentRequest(payload, tokenData, navigation));
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
          action: 'invited',
          userType: filterType,
          limit: 30,
          pageNo: 1,
          searchQuery: search,
          sortOrder: shortType,
        };

        dispetch(SentRequest(payload, tokenData, navigation));
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
      action: 'invited',
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
      dispetch(SentRequest(payload, token, navigation));
    }, 500);
  };

  const onDelete = () => {
    setModalOpen(false);
    setTimeout(() => {
      let payload = {
        currentUserId: userID,
        action: 'removeInvitation',
        id: deleteID,
        limit: 30,
        pageNo: 1,
        userType: filterType,
      };
      dispetch(loaderAction(true));
      dispetch(InvitedStatusRequest(payload, token, navigation));
    }, 500);
  };

  const clearData = () => {
    setTop(false), setAtoz(false), setZtoa(false);
    setShortType('');
    refreshApi();
    refRBSheet.current.close();
  };

  const onPaginationCalled = () => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        action: 'invited',
        limit: 30,
        pageNo: page + 1,
        userType: filterType,
        sortOrder: shortType,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(SentRequest(payload, token, navigation));
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <ActiveCard
        item={item}
        index={index}
        screentype="Invited"
        deleteonPress={() => {
          setDeleteID(item?._id);
          setModalOpen(true);
          setSuccessModalOpen(false);
        }}
      />
    );
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
                You have not sent any invitation
              </Text>
            )}
          </>
        )}
      </View>
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
        action: 'invited',
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
          refreshing={refreshing}
          contentContainerStyle={{ flexGrow: 1 }}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyComponent />}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onEndReached={({ data }) => onPaginationCalled()}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
          modalTitle={'Rescind Invite'}
          savelable="Confirm"
          canclelable="Cancel"
          modalStyle={successModalOpen === true ? 'success' : ''}
          details={
            successModalOpen === true
              ? 'Invite has been rescinded successfully.'
              : 'Are you sure you want to rescind this invite?'
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

export default InvitedScreen;

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
