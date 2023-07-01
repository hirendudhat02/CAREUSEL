import React, {useState, useEffect} from 'react';
import {Input} from '../../../components';
import {SignupContent} from '../components';
import Regex from '../../../utils/helper';
import ErrorComponent from '../../../components/Error';
import {useDispatch, useSelector} from 'react-redux';
import {BasicInfoRequest} from '../../../redux/Action/BasucInfoAction';
import {loaderAction} from '../../../redux/Action/LoaderAction';
import AutoCompleteInput from '../../../components/AutoCompleteInput';
import axios from 'axios';
import {
  GetEmailsdRequest,
  GetEmailsResponse,
} from '../../../redux/Action/GetEmailsAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

let GOOGLE_API_KEY = 'AIzaSyCs3ctR7Ba5A6TBv8l4LyznS16k96UaRAo';
let GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const BasicInfo = ({initialState = {}, onBasicInfoComplete, onLoader}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [fetchPredictions, setFetchPredictions] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState({
    firstname: null,
    lastname: null,
    email: null,
    number: null,
    address: null,
  });
  const dispetch = useDispatch();
  const laderResponse = useSelector(state => state.loader);
  const basicInfoResponse = useSelector(state => state.basicinfo);
  const getemailsResponse = useSelector(state => state.getemails);
  useEffect(() => {
    AsyncStorage.getItem('SignUpData').then(Data => {
      if (Data !== null) {
        let UserData = JSON.parse(Data);
        let filupData = UserData.updateBody;
        setEmail(filupData.email);
        setFirstname(filupData.firstName);
        setLastname(filupData.lastName);
        setNumber(filupData.phoneNumber);
        setAddress(filupData.address);
      }
    });
  }, []);
  useEffect(() => {
    if (getemailsResponse.data !== null) {
      if (getemailsResponse.data === true) {
        const editErrorState = {...error};
        editErrorState.email = 'This email is already registered';
        setError(editErrorState);
      } else {
        const editErrorState = {...error};
        editErrorState.email = null;
        setError(editErrorState);
        let payload = {
          email: email,
          updateBody: {
            userType: 'client',
            prefix: '',
            email: email.toLowerCase(),
            firstName: firstname,
            lastName: lastname,
            phoneNumber: number,
            otp: null,
            registeringAs: '',
            address: address,
          },
          signupType: 'directSignup',
          userType: 'client',
          accessToken: null,
        };

        let key = 'basicinfo';
        dispetch(loaderAction(true));
        dispetch(BasicInfoRequest(payload, key));
      }
      dispetch(GetEmailsResponse(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getemailsResponse]);

  useEffect(() => {
    if (laderResponse !== undefined) {
      onLoader(laderResponse.loader);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laderResponse]);
  useEffect(() => {
    if (basicInfoResponse.data !== null) {
      onBasicInfoComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfoResponse]);
  const onNextPress = async () => {
    let isValid = true;
    const editErrorState = {...error};

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

    if (!Regex.validateEmail(email)) {
      isValid = false;
      editErrorState.email = 'Please enter valid email address';
    } else {
      editErrorState.email = null;
    }

    if (!Regex.validateMobile(number)) {
      isValid = false;
      editErrorState.number = 'Please enter valid contact number';
    } else {
      editErrorState.number = null;
    }

    if (!Regex.validateAddress(address)) {
      isValid = false;
      editErrorState.address = 'Please enter valid address';
    } else {
      editErrorState.address = null;
    }

    setError(editErrorState);

    if (isValid) {
      let payload = {
        email: email,
      };
      dispetch(loaderAction(true));
      dispetch(GetEmailsdRequest(payload));
    }
  };

  const onChangeText = async () => {
    // console.log('Result is--->', address);

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${address}`;
    // console.log('fgtbhc', apiUrl);
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      // console.log('hncgthnc', result);
      if (result) {
        const {
          data: {predictions},
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
    <SignupContent
      title={'Basic Info'}
      onButtonPress={() => onNextPress()}
      loadervalue={laderResponse.loader}
      disabled={
        firstname !== '' &&
        lastname !== '' &&
        number !== '' &&
        address !== '' &&
        email !== ''
          ? false
          : true
      }
      visible={true}>
      <Input
        placeholder="Enter First Name"
        label="First Name"
        value={firstname}
        autoCapitalize="words"
        onChangeText={txt => {
          setFirstname(CapitalizeFirstLetter(txt));
          error.firstname = null;
        }}
        maxLength={60}
      />
      {error.firstname !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.firstname} />
      ) : null}
      <Input
        placeholder="Enter Last name"
        label="Last Name"
        autoCapitalize="words"
        value={lastname}
        onChangeText={txt => {
          setLastname(CapitalizeFirstLetter(txt));
          error.lastname = null;
        }}
        maxLength={60}
      />
      {error.lastname !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.lastname} />
      ) : null}
      <Input
        placeholder="Enter Email Address"
        label="Email Address"
        keyboardType="email-address"
        value={email}
        maxLength={60}
        onChangeText={txt => {
          setEmail(txt);
          error.email = null;
        }}
        autoCapitalize="none"
      />
      {error.email !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.email} />
      ) : null}
      <Input
        inputStyle="MaskInput"
        placeholder="Enter Contact Number"
        label="Contact Number"
        keyboardType="phone-pad"
        value={number}
        maxLength={14}
        onChangeText={masked => {
          setNumber(masked);
          error.number = null;
        }}
      />
      {error.number !== null ? (
        <ErrorComponent right={'right'} errorMessage={error.number} />
      ) : null}
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
            setFetchPredictions(false);
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
        <ErrorComponent right={'right'} errorMessage={error.address} />
      ) : null}
    </SignupContent>
  );
};

export default BasicInfo;

// const styles = StyleSheet.create({
//   title: {
//     fontSize: moderateScale(22),
//     marginVertical: 20,
//   },
//   address: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
// });
