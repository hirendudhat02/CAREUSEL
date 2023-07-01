import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {InvitedStatusResponse} from '../Action/InvitedStatusAction';
import {loaderAction} from '../Action/LoaderAction';

export function* InvitedStatusSaga(action) {
  const {bodydata, token, navigation} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.CONNECTIONSTATUS,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(bodydata),
      },
    );
    var responseJson = yield response.json();

    if (responseJson.status === 'success') {
      yield put(InvitedStatusResponse(responseJson));
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
