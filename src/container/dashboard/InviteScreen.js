import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { Button, Container, Input, Text } from '../../components';
import { colors } from '../../theme';
import InviteCard from './components/Invitecard';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import { loaderAction } from '../../redux/Action/LoaderAction';
import {
  InviteUserRequest,
  InviteUserResponse,
} from '../../redux/Action/InviteUserAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../helpers/loader';
import { InvitedRequest } from '../../redux/Action/InvitedAction';
import { images } from '../../assets';
import { moderateScale } from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import Constant from '../../helpers/Constant';
const InviteScreen = memo(props => {
  const [search, setSearch] = useState('');
  const [checkedData, setCheckedData] = useState([]);
  const [selectedData, setSlectedData] = useState([]);
  const [client, setClient] = useState(false);
  const [expert, setExpert] = useState(false);
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const refRBSheet = useRef();
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const inviteuserResponse = useSelector(state => state.invite);

  useEffect(() => {
    if (inviteuserResponse.data !== null) {
      let Apidata = inviteuserResponse.data?.data;

      if (Apidata?.length === 30) {
        setLoadMore(true);
      } else {
        setLoadMore(false);
      }
      if (Apidata.length !== 0) {
        const newData = [...checkedData];
        if (Apidata.length !== 0) {
          if (selectedData.length !== 0) {
            Apidata.map((item, index) => {
              selectedData.map(itemidx => {
                if (item._id === itemidx._id) {
                  Apidata[index] = { ...item, checked: true };
                }
              });
            });
          }
        }
        var newArray = newData.concat(Apidata);
        setCheckedData(newArray);
      }
      dispetch(InviteUserResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteuserResponse]);
  useEffect(() => {
    setLoadMore(false);
    setCheckedData([]);
    setPage(1);

    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      let tokenData = UserData.accessToken[0];
      setUserID(UserData._id);
      setToken(tokenData);
      let payload = {
        currentUserId: UserData._id,
        userType: '',
        limit: 30,
        pageNo: 1,
        searchQuery: '',
      };

      dispetch(loaderAction(true));
      dispetch(InviteUserRequest(payload, tokenData, props.navigation));
    });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefreshApi();
    wait(1500).then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefreshApi = () => {
    setLoadMore(false);
    setPage(1);
    setSearch('');
    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      let tokenData = UserData.accessToken[0];
      setCheckedData([]);
      let payload = {
        currentUserId: UserData._id,
        userType: '',
        limit: 30,
        pageNo: 1,
        searchQuery: search,
      };
      dispetch(InviteUserRequest(payload, tokenData, props.navigation));
    });
  };

  const refreshApi = clear => {
    Keyboard.dismiss();
    setLoadMore(false);
    setPage(1);
    setClient(false);
    setExpert(false);
    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      let tokenData = UserData.accessToken[0];
      setCheckedData([]);
      let payload = {
        currentUserId: UserData._id,
        userType: '',
        limit: 30,
        pageNo: 1,
        searchQuery: clear === 'clear' ? '' : search,
      };

      dispetch(loaderAction(true));
      dispetch(InviteUserRequest(payload, tokenData, props.navigation));
    });
  };

  const onFilter = () => {
    setLoadMore(false);
    setCheckedData([]);
    setPage(1);
    if (client) {
      let payload = {
        currentUserId: userID,
        userType: 'expert',
        limit: 30,
        pageNo: 1,
        searchQuery: search,
      };
      setTimeout(() => {
        dispetch(loaderAction(true));
        dispetch(InviteUserRequest(payload, token, props.navigation));
      }, 500);
    } else {
      let payload = {
        currentUserId: userID,
        userType: 'client',
        limit: 30,
        pageNo: 1,
        searchQuery: search,
      };
      setTimeout(() => {
        dispetch(loaderAction(true));
        dispetch(InviteUserRequest(payload, token, props.navigation));
      }, 500);
    }
    refRBSheet.current.close();
  };

  const checkFuction = (item, index) => {
    let temp = [...checkedData];
    let selected = selectedData;

    temp.map((tempItem, tenpIndex) => {
      if (tempItem._id === item._id) {
        if (item.checked !== undefined) {
          if (item.checked === true) {
            item.checked = false;
            let filterData = selected.filter(iditem => item._id !== iditem._id);
            selected = filterData;
          } else {
            selected.push({ ...item, checked: true });
            item.checked = true;
          }
        } else {
          selected.push({ ...item, checked: true });
          temp[tenpIndex] = { ...item, checked: true };
        }
      }
      setCheckedData([...temp]);
    });
    setSlectedData([...selected]);
  };

  const onPaginationCalled = pageIncr => {
    if (loadMore === true) {
      setPage(page + 1);
      let payload = {
        currentUserId: userID,
        userType: client === true ? 'expert' : expert === true ? 'client' : '',
        limit: 30,
        pageNo: page + 1,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(InviteUserRequest(payload, token, props.navigation));
    }
  };
  const navigateToScreen = useCallback(item => {
    props.navigation.navigate('clientProfile', {
      data: item,
      screen: item.userType === 'expert' ? 'Expert Profile' : 'Client Profile',
      navigate: 'invite',
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <InviteCard
        item={item}
        index={index}
        profileonPress={() => {
          navigateToScreen(item);
        }}
        iconPress={() => checkFuction(item, index)}
        iconname={item.checked === true ? 'checked' : 'unchecked'}
      />
    );
  };

  const onClearRefresh = () => {
    setLoadMore(false);
    setCheckedData([]);
    setPage(1);
    setClient(false);
    setExpert(false);
    refRBSheet.current.close();
    AsyncStorage.getItem('userdata').then(Data => {
      let UserData = JSON.parse(Data);
      let tokenData = UserData.accessToken[0];
      setUserID(UserData._id);
      setToken(tokenData);
      let payload = {
        currentUserId: UserData._id,
        userType: '',
        limit: 30,
        pageNo: 1,
        searchQuery: search,
      };
      dispetch(loaderAction(true));
      dispetch(InviteUserRequest(payload, tokenData, props.navigation));
    });
  };

  const inviteAction = () => {
    let payload = {
      userList: selectedData,
      invitee: userID,
    };
    dispetch(loaderAction(true));
    dispetch(InvitedRequest(payload, token, props.navigation));
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
                Unable to find anyone right now. Please try again later.
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
      setCheckedData([]);
      setPage(1);
      let payload = {
        currentUserId: userID,
        userType: client === true ? 'expert' : expert === true ? 'client' : '',
        limit: 30,
        pageNo: 1,
        searchQuery: searchText,
      };

      await fetch(Constant.baseURL + Constant.end_Point.INVITEUSER + userID, {
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
          let Apidata = result.data;
          if (Apidata?.length === 30) {
            setLoadMore(true);
          } else {
            setLoadMore(false);
          }
          if (Apidata.length !== 0) {
            if (selectedData.length !== 0) {
              Apidata.map((item, index) => {
                selectedData.map(itemidx => {
                  if (item._id === itemidx._id) {
                    Apidata[index] = { ...item, checked: true };
                  }
                });
              });
            }

            setCheckedData(Apidata);
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
    <View style={{ flexGrow: 1 }}>
      <Container
        title={'Invite to My Circle'}
        iconRight={'filtericon'}
        iconLeft={'Back'}
        onIconRightPress={() => refRBSheet.current.open()}
        onIconLeftPress={() => props.navigation.goBack('')}>
        <View style={styles.container}>
          {/* <Watermark /> */}
          <View style={styles.searchContainer}>
            <View style={{ width: '100%' }}>
              <Input
                onIconPress={() => {
                  setSearch('');
                  let clear = 'clear';
                  refreshApi(clear);
                }}
                placeholder="Search user"
                icon={search !== '' ? 'close' : 'searchwhite'}
                value={search}
                onChangeText={txt => setSearch(txt)}
              />
            </View>
          </View>

          <FlatList
            data={checkedData}
            onEndReached={({ data }) => onPaginationCalled()}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ marginHorizontal: 10, flexGrow: 1 }}
            keyboardDismissMode="on-drag"
            ListEmptyComponent={<ListEmptyComponent />}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
          {!isKeyboardVisible && (
            <View style={styles.buttonview}>
              <Button
                onPress={() => {
                  props.navigation.goBack('');
                }}
                isOutlined
                label={'Cancel'}
              />
              <Button
                disabled={selectedData.length === 0 ? true : false}
                onPress={() => {
                  inviteAction();
                }}
                label={'Invite'}
              />
            </View>
          )}

          <Bottomsheet
            sheettype="filter"
            refRBSheet={refRBSheet}
            client={client}
            expert={expert}
            clientonpress={() => {
              setClient(client === true ? false : true);
              setExpert(false);
            }}
            expertonpress={() => {
              setExpert(expert === true ? false : true);
              setClient(false);
            }}
            clearonpress={() => {
              onClearRefresh();
            }}
            doneonpress={() => {
              onFilter();
            }}
          />
        </View>
      </Container>
      <Loader value={laderResponse.loader} />
    </View>
  );
});

export default InviteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingVertical: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    padding: 10,
  },
  buttonview: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
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
