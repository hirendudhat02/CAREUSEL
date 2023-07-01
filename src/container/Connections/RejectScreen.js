import { FlatList, StyleSheet, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Input, Text, Watermark } from '../../components';
import { colors } from '../../theme';
import ActiveCard from './components/ActiveCard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loaderAction } from '../../redux/Action/LoaderAction';
import Loader from '../../helpers/loader';
import {
  RejectedRequest,
  RejectedResponse,
} from '../../redux/Action/RejectedAction';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import { RejectFilterAction } from '../../redux/Action/RejectFilter';
import Constant from '../../helpers/Constant';
const RejectScreen = memo(({ navigation }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [top, setTop] = useState(false);
  const [atoZ, setAtoz] = useState(false);
  const [ztoA, setZtoa] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [shortType, setShortType] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const dispetch = useDispatch();
  const refRBSheet = useRef();
  const laderResponse = useSelector(state => state.loader);
  const ActionResponse = useSelector(state => state.rejected);
  const RejectFilterResponse = useSelector(state => state.rejectefilter);

  useEffect(() => {
    if (
      RejectFilterResponse.filter !== null &&
      RejectFilterResponse.filter !== undefined
    ) {
      setFilterType(RejectFilterResponse.filter);
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
            action: 'rejected',
            userType: RejectFilterResponse.filter,
            limit: 30,
            pageNo: 1,
            sortOrder: shortType,
            searchQuery: search,
          };
          dispetch(loaderAction(true));
          setData([]);
          dispetch(RejectedRequest(payload, tokenData, navigation));
        }
      });
      dispetch(RejectFilterAction(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RejectFilterResponse]);

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
          action: 'rejected',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: clear === 'clear' ? '' : search,
        };
        dispetch(loaderAction(true));
        dispetch(RejectedRequest(payload, tokenData, navigation));
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
          action: 'rejected',
          limit: 30,
          pageNo: 1,
          userType: filterType,
          sortOrder: shortType,
          searchQuery: search,
        };
        dispetch(RejectedRequest(payload, tokenData, navigation));
      }
    });
  };

  useMemo(() => {
    if (ActionResponse.data !== null) {
      if (ActionResponse.data !== null) {
        let Apidata = ActionResponse.data?.data.userList ?? [];

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
        dispetch(RejectedResponse(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActionResponse]);

  const filterData = () => {
    refRBSheet.current.close();
    setLoadMore(false);
    setPage(1);
    setData([]);
    let payload = {
      currentUserId: userID,
      action: 'rejected',
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
      dispetch(RejectedRequest(payload, token, navigation));
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

  const onPaginationCalled = pageIncr => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        action: 'rejected',
        limit: 30,
        pageNo: page + 1,
        userType: filterType,
        sortOrder: shortType,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(RejectedRequest(payload, token, navigation));
    }
  };

  const renderItem = ({ item, index }) => {
    return <ActiveCard item={item} index={index} screentype="Reject" />;
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
        action: 'rejected',
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
                You have no inactivated users.
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
          onEndReached={({ data }) => onPaginationCalled()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<ListEmptyComponent />}
          keyExtractor={item => item.id}
          renderItem={renderItem}
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
        <Loader value={laderResponse.loader} />
      </View>
    </>
  );
});

export default RejectScreen;

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
