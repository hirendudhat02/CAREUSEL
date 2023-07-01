import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {loaderAction} from '../Action/LoaderAction';
import {ProfileUpdateResponse} from '../Action/ProfileUpdateAction';

export function* ProfileUpdateSaga(action) {
  const {bodydata, userId, token, navigation} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.UPDATE + userId,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: bodydata,
      },
    );
    var responseJson = yield response.json();

    if (responseJson.status === 'success') {
      yield put(ProfileUpdateResponse(responseJson));

      yield put(loaderAction(false));
    } else {
      if (responseJson.data.action === 'logout') {
        Toast.show(responseJson.data.message, 'danger');
        yield put(loaderAction(false));
        AsyncStorage.clear();
        navigation.replace('LoginStack');
      } else {
        yield put(loaderAction(false));
        Toast.show(responseJson.data.message, 'danger');
      }
    }
  } catch (err) {
    console.log(err);
    Toast.show('Something went wrong', 'danger');
    yield put(loaderAction(false));
  }
}
