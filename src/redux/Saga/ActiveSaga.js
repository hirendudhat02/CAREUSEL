import AsyncStorage from '@react-native-async-storage/async-storage';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {ActiveResponse} from '../Action/ActiveAction';
import {loaderAction} from '../Action/LoaderAction';

export function* ActiveSaga(action) {
  const {bodydata, token, navigation} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.CONNECTION,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodydata),
      },
    );

    var responseJson = yield response.json();

    if (responseJson.status === 'success') {
      yield put(ActiveResponse(responseJson));
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
