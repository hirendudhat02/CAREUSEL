import React, { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Container, Icon, Input, Text } from '../../components';
import { colors } from '../../theme';
import ImagePicker from 'react-native-image-crop-picker';
import Bottomsheet from '../../components/bottomsheet/bottomsheet';
import Regex from '../../utils/helper';
import ErrorComponent from '../../components/Error';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { loaderAction } from '../../redux/Action/LoaderAction';
import {
  EditProfileRequest,
  EditProfileResponse,
} from '../../redux/Action/EditProfileAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loader from '../../helpers/loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../assets';
import { MyProfileRequest } from '../../redux/Action/MyProfileAction';
import { moderateScale, verticalScale } from '../../helpers/ResponsiveFonts';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import axios from 'axios';
import { ProfileUpdateRequest } from '../../redux/Action/ProfileUpdateAction';
import FastImage from 'react-native-fast-image';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COMETCHAT_CONSTANTS } from '../../CONSTS';
import Toast from '../../utils/toast';
import { Alert } from 'react-native';

let GOOGLE_API_KEY = 'AIzaSyCs3ctR7Ba5A6TBv8l4LyznS16k96UaRAo';
let GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const EditProfile = ({ route, navigation }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [addText, setAddText] = useState('');
  const [hereData, setHereData] = useState([]);
  const [image, setImage] = useState('');
  const [uploadeimage, setUploadeImage] = useState({});
  const [about, setAbout] = useState('');
  const [instaLink, setInstaLink] = useState('');
  const [barthDate, setBarthDate] = useState('');
  const [facwBookLink, setFaceBookLink] = useState('');
  const [open, setOpen] = useState(false);
  const [fetchPredictions, setFetchPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const refRBSheet = useRef();
  const [error, setError] = useState({
    firstname: null,
    lastname: null,
    email: null,
    number: null,
    address: null,
    hereData: null,
    barthDate: null,
    facwBookLink: null,
    instaLink: null,
    about: null,
    imhere: null,
  });
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const editprofileResponse = useSelector(state => state.editprofile);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('userdata').then(Data => {
        let UserData = JSON.parse(Data);
        setToken(UserData.accessToken[0]);
      });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params !== undefined) {
      let routdata = route.params.data;
      if (
        routdata?.firstName !== undefined &&
        routdata?.firstName !== null &&
        routdata?.firstName !== ''
      ) {
        setFirstname(routdata?.firstName);
      }
      if (
        routdata?.lastName !== undefined &&
        routdata?.lastName !== null &&
        routdata?.lastName !== ''
      ) {
        setLastname(routdata?.lastName);
      }
      if (
        routdata?.email !== undefined &&
        routdata?.email !== null &&
        routdata?.email !== ''
      ) {
        setEmail(routdata?.email);
      }
      if (
        routdata?.phoneNumber !== undefined &&
        routdata?.phoneNumber !== null &&
        routdata?.phoneNumber !== ''
      ) {
        setNumber(routdata?.phoneNumber);
      }
      if (
        routdata?.address !== undefined &&
        routdata?.address !== null &&
        routdata?.address !== ''
      ) {
        setAddress(routdata?.address);
      }
      if (
        routdata?.focusList !== undefined &&
        routdata?.email !== null &&
        routdata?.email !== null
      ) {
        setHereData(routdata.focusList);
      }
      if (
        routdata?._id !== undefined &&
        routdata?._id !== null &&
        routdata?._id !== ''
      ) {
        setUserId(routdata?._id);
      }
      if (
        routdata?.aboutMe !== undefined &&
        routdata?.aboutMe !== null &&
        routdata?.aboutMe !== ''
      ) {
        setAbout(routdata?.aboutMe);
      }
      if (
        routdata?.instaLink !== undefined &&
        routdata?.instaLink !== null &&
        routdata?.instaLink !== ''
      ) {
        setInstaLink(routdata?.instaLink);
      }
      if (
        routdata?.facebookLink !== undefined &&
        routdata?.facebookLink !== null &&
        routdata?.facebookLink !== ''
      ) {
        setFaceBookLink(routdata?.facebookLink);
      }
      if (
        routdata?.dob !== undefined &&
        routdata?.dob !== null &&
        routdata?.dob !== ''
      ) {
        setBarthDate(moment(routdata?.dob).format('MM/DD/YYYY'));
      }
      if (
        routdata?.profilePicUrl !== undefined &&
        Regex.validateURL(routdata?.profilePicUrl)
      ) {
        setImage(routdata?.profilePicUrl);
      }
    }
  }, [route]);

  useEffect(() => {
    if (editprofileResponse.data !== null) {
      let payload = {
        userId: userId,
        token: token,
      };
      dispetch(loaderAction(true));
      dispetch(MyProfileRequest(payload, navigation));
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
      dispetch(EditProfileResponse(null));
    }
  }, [editprofileResponse]);

  const AddselectText = () => {
    if (hereData.length > 4) {
      const editErrorState = { ...error };
      editErrorState.imhere = 'You have reached limit to add Max 5 Focuses';
      setError(editErrorState);
    } else {
      hereData.push(addText);
      setHereData([...hereData]);
      setAddText('');
      error.imhere = null;
    }
  };

  const onSelectedRemove = indx => {
    const defaultFiles = [...hereData];
    const selectedFiles = defaultFiles.filter((item, index) => index !== indx);
    setHereData(selectedFiles);
  };

  const onGalleryPress = async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      maxFiles: 1,
      cropping: true,
    });

    setUploadeImage(result);
    setImage(result.path);
    refRBSheet.current.close();
  };

  const onCameraPress = async () => {
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      maxFiles: 1,
      multiple: false,
    });

    setUploadeImage(result);
    setImage(result.path);
    refRBSheet.current.close();
  };
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') {
      onGalleryPress();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          'android.permission.WRITE_EXTERNAL_STORAGE',
          {
            title: 'Cool Photo App Gallery Permission',
            message:
              'Cool Photo App needs access to your Gallery ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onGalleryPress();
        } else {
          refRBSheet.current.close();
          Alert.alert(
            'Oops!!',
            'Permission not granted for Gallery',
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
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      onCameraPress();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
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
          onCameraPress();
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
  };

  const onSavePress = async () => {
    let isValid = true;
    const editErrorState = { ...error };
    if (!Regex.validateEmail(email)) {
      isValid = false;
      editErrorState.email = 'Please enter valid email address';
    } else {
      editErrorState.email = null;
    }

    if (!Regex.validateString(firstname)) {
      isValid = false;
      editErrorState.firstname = 'Please enter valid first name';
    } else {
      editErrorState.firstname = null;
    }

    if (!Regex.validateString(lastname)) {
      isValid = false;
      editErrorState.lastname = 'Please enter valid last name';
    } else {
      editErrorState.lastname = null;
    }

    if (number.length !== 0) {
      if (!Regex.validateMobile(number)) {
        isValid = false;
        editErrorState.number = 'Please enter valid contact number';
      } else {
        editErrorState.number = null;
      }
    } else {
      editErrorState.number = null;
    }

    if (!Regex.validateAddress(address)) {
      isValid = false;
      editErrorState.address = 'Please enter valid address';
    } else {
      editErrorState.address = null;
    }

    if (about.length !== 0) {
      if (!Regex.validateAddress(about)) {
        isValid = false;
        editErrorState.about = 'Please enter valid about';
      } else {
        editErrorState.about = null;
      }
    } else {
      editErrorState.about = null;
    }

    if (instaLink.length !== 0) {
      if (!Regex.validateURL(instaLink)) {
        isValid = false;
        editErrorState.instaLink = 'Please enter valid Instagram Link';
      } else {
        editErrorState.instaLink = null;
      }
    } else {
      editErrorState.instaLink = null;
    }

    if (facwBookLink.length !== 0) {
      if (!Regex.validateURL(facwBookLink)) {
        isValid = false;
        editErrorState.facwBookLink = 'Please enter valid Facebook Link';
      } else {
        editErrorState.facwBookLink = null;
      }
    } else {
      editErrorState.facwBookLink = null;
    }

    setError(editErrorState);

    if (isValid) {
      Keyboard.dismiss();
      let payload = {
        userId: userId,
        updateBody: {
          userType: 'client',
          email: email,
          firstName: firstname,
          lastName: lastname,
          phoneNumber: number,
          dob: barthDate,
          // profilePic: image,
          // otp: null,
          address: address,
          focusList: hereData,
          instaLink: instaLink,
          facebookLink: facwBookLink,
          aboutMe: about,
        },
        signupType: 'directSignup',
        userType: 'client',
      };

      CometChat.getLoggedinUser().then(userData => {
        if (userData.name !== firstname + ' ' + lastname) {
          let user = new CometChat.User(userId);
          user.setName(firstname + ' ' + lastname);
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
      });

      if (Object.keys(uploadeimage).length !== 0) {
        dispetch(loaderAction(true));
        let profiledata = {
          uri: uploadeimage.path,
          name:
            Platform.OS === 'ios'
              ? uploadeimage.filename
              : uploadeimage.path.replace(/^.*[\\\/]/, ''),
          type: uploadeimage.mime,
        };
        var dataForm = new FormData();
        dataForm.append('profilePic', profiledata);
        dispetch(ProfileUpdateRequest(dataForm, userId, token, navigation));
        dispetch(loaderAction(true));
        dispetch(EditProfileRequest(payload, token, navigation));
      } else {
        dispetch(loaderAction(true));
        dispetch(EditProfileRequest(payload, token, navigation));
      }
    }
  };

  const onChangeText = async () => {
    console.log('Result is--->', address);

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${address}`;
    // console.log('fgtbhc', apiUrl);
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      console.log('hncgthnc', result);
      if (result) {
        const {
          data: { predictions },
        } = result;

        setPredictions(predictions);
        setFetchPredictions(false);
      }
    } catch (e) {
      setFetchPredictions(false);
      console.log('error-->', e);
    }
  };

  const onSuggestionClicked = async (placeId, description) => {
    setAddress(description);
    setFetchPredictions(false);
  };
  const CapitalizeFirstLetter = str => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };

  return (
    <View style={{ flex: 1 }}>
      <Container
        title={'Profile'}
        iconLeft={'Back'}
        onIconLeftPress={() => navigation.goBack('')}>
        <KeyboardAvoidingView
          enabled={true}
          style={{ flexGrow: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={verticalScale(60)}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.profileview}>
                <View style={styles.profileimage}>
                  <FastImage
                    source={image !== '' ? { uri: image } : images.defaultphoto}
                    style={styles.chat_avatar}
                    resizeMode="cover"
                  />
                  <Icon
                    style={styles.editProfileicon}
                    name="pencil"
                    size={15}
                    height={15}
                    onPress={() => refRBSheet.current.open()}
                  />
                </View>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                setPredictions([]);
                setFetchPredictions(false);
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 50,
                  paddingBottom: 20,
                }}>
                <Text isBold style={styles.editProfiletitle}>
                  Edit Profile
                </Text>
                <View>
                  <Input
                    placeholder="Enter First Name"
                    label="First Name"
                    value={firstname}
                    maxLength={60}
                    autoCapitalize="words"
                    onChangeText={txt => {
                      setFirstname(CapitalizeFirstLetter(txt));
                      error.firstname = null;
                    }}
                  />
                  {error.firstname !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.firstname}
                    />
                  ) : null}
                  <Input
                    placeholder="Enter Last Name"
                    label="Last Name"
                    autoCapitalize="words"
                    value={lastname}
                    maxLength={60}
                    onChangeText={txt => {
                      setLastname(CapitalizeFirstLetter(txt));
                      error.lastname = null;
                    }}
                  />
                  {error.lastname !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.lastname}
                    />
                  ) : null}
                  <Input
                    placeholder="Enter Email Address"
                    label="Email Address"
                    keyboardType="email-address"
                    value={email}
                    maxLength={60}
                    autoCapitalize="none"
                    editable={false}
                    onChangeText={txt => {
                      setEmail(txt);
                      error.email = null;
                    }}
                  />
                  {error.email !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.email}
                    />
                  ) : null}
                  <Input
                    placeholder="Enter Contact Number"
                    label="Contact Number"
                    inputStyle="MaskInput"
                    keyboardType="phone-pad"
                    value={number}
                    maxLength={14}
                    onChangeText={masked => {
                      setNumber(masked);
                      error.number = null;
                    }}
                  />
                  {error.number !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.number}
                    />
                  ) : null}

                  <Input
                    inputStyle="Birthday"
                    onPressInput={() => setOpen(true)}
                    editable={false}
                    placeholder="Enter Birthday"
                    label="Birthday"
                    value={barthDate}
                    onChangeText={setBarthDate}
                  />

                  <Input
                    placeholder="Enter Instagram link"
                    label="Instagram"
                    value={instaLink}
                    maxLength={60}
                    onChangeText={txt => {
                      setInstaLink(txt);
                      error.instaLink = null;
                    }}
                  />
                  {error.instaLink !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.instaLink}
                    />
                  ) : null}
                  <Input
                    placeholder="Enter Facebook link"
                    label="Facebook"
                    value={facwBookLink}
                    maxLength={60}
                    onChangeText={txt => {
                      setFaceBookLink(txt);
                      error.facwBookLink = null;
                    }}
                  />
                  {error.facwBookLink !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.facwBookLink}
                    />
                  ) : null}
                  {/* <Input
                  multiline
                  numberOfLines={4}
                  style={styles.address}
                  placeholder="Enter Address"
                  label="Address"
                  value={address}
                  maxLength={120}
                  onChangeText={txt => {
                    setAddress(txt);
                    error.address = null;
                  }}
                /> */}

                  <AutoCompleteInput
                    label={'Address'}
                    list={predictions}
                    placeholder="Enter Address"
                    show={predictions.length ? true : false}
                    inputvalue={address}
                    onChange={data => {
                      setAddress(data);
                      error.address = null;
                      if (data !== '') {
                        setFetchPredictions(true);
                        onChangeText();
                      } else {
                        setPredictions([]);
                      }
                    }}
                    listname="description"
                    load={fetchPredictions}
                    onPress={(placeId, description) => {
                      setPredictions([]);
                      onSuggestionClicked(placeId, description);
                    }}
                  />

                  {error.address !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.address}
                    />
                  ) : null}

                  <Input
                    multiline
                    numberOfLines={4}
                    style={styles.address}
                    placeholder="Enter About Me"
                    label="About Me"
                    value={about}
                    maxLength={120}
                    onChangeText={txt => {
                      setAbout(txt);
                      error.about = null;
                    }}
                  />
                  {error.about !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.about}
                    />
                  ) : null}
                  <Input
                    textInputtype={addText !== '' ? 'Here' : null}
                    placeholder="Enter What I’m Here For"
                    label="What I’m Here For"
                    maxLength={60}
                    // editable={hereData.length < 5 ? true : false}
                    addonPress={() => {
                      AddselectText();
                    }}
                    value={addText}
                    onChangeText={txt => {
                      setAddText(txt), (error.imhere = null);
                    }}
                  />
                  {error.imhere !== null ? (
                    <ErrorComponent
                      right={'right'}
                      errorMessage={error.imhere}
                    />
                  ) : null}
                  <FlatList
                    data={hereData}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatlistcontainer}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.selectview}>
                          <Text isSemiBold style={styles.aboutselect}>
                            {item}
                          </Text>
                          <TouchableOpacity
                            style={{ padding: 5 }}
                            onPress={() => onSelectedRemove(index)}>
                            <FastImage
                              source={images.closeblue}
                              style={{ height: 15, width: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>
                <View style={styles.buttonview}>
                  <Button
                    onPress={() => {
                      navigation.goBack('');
                    }}
                    isOutlined
                    label={'Cancel'}
                  />

                  <Button
                    disabled={
                      firstname !== '' &&
                        lastname !== '' &&
                        address !== '' &&
                        number !== '' &&
                        email !== ''
                        ? false
                        : true
                    }
                    onPress={() => {
                      onSavePress();
                    }}
                    label={'Save'}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
      <Bottomsheet
        sheettype="profile"
        refRBSheet={refRBSheet}
        galleryonpress={() => {
          requestGalleryPermission();
        }}
        cameraonpress={() => {
          requestCameraPermission();
        }}
      />
      <DatePicker
        modal
        mode="date"
        date={new Date()}
        maximumDate={new Date()}
        format="MM-DD-YYYY"
        open={open}
        onConfirm={dateObject => {
          setOpen(false);
          const formatDate = moment(dateObject).format('MM-DD-YYYY');
          setBarthDate(formatDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Loader value={laderResponse.loader} />
    </View>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: colors.white,
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
  address: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  editProfiletitle: {
    fontSize: moderateScale(24),
    paddingVertical: 10,
  },
  aboutselect: {
    color: colors.secoundry,
    fontWeight: '500',
    fontSize: moderateScale(16),
    paddingRight: 15,
  },
  selectview: {
    borderWidth: 2,
    borderColor: colors.secoundry,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  flatlistcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  editProfileicon: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 25,
  },
});
