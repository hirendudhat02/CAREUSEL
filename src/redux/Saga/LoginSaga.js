import { Alert } from 'react-native';
import { put } from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import { loaderAction } from '../Action/LoaderAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../Action/LoginAction';
import Toast from '../../utils/toast';
export function* loginSaga(action) {
  const { bodydata, navigation } = action;

  try {
    const response = yield fetch(Constant.baseURL + Constant.end_Point.LOGIN, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodydata),
    });
    var responseJson = yield response.json();

    if (responseJson.status === 'success') {
      if (responseJson.data.userType === 'expert') {
        Toast.show('You are an expert so please login to the web', 'danger');
        yield put(loaderAction(false));
      } else {
        yield put(LoginResponse(responseJson.data));
        yield put(loaderAction(false));
      }
      yield put(loaderAction(false));
    } else {
      yield put(loaderAction(false));
      yield put(LoginResponse(null));
      Toast.show(responseJson.data.message, 'danger');
    }
  } catch (err) {
    console.log(err);
    Toast.show('Something went wrong', 'danger');
    yield put(loaderAction(false));
  }
}
