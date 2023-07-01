import AsyncStorage from '@react-native-async-storage/async-storage';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {loaderAction} from '../Action/LoaderAction';
import {PasswordResponse} from '../Action/PasswordAction';

export function* PasswordSaga(action) {
  const {bodydata} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.PASSWORD,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodydata),
      },
    );
    var responseJson = yield response.json();

    if (responseJson.status === 'success') {
      yield put(loaderAction(false));
      yield put(PasswordResponse(responseJson));
    } else {
      yield put(loaderAction(false));
      Toast.show(responseJson.data.message, 'danger');
    }
  } catch (err) {
    console.log(err);
    Toast.show('Something went wrong', 'danger');
    yield put(loaderAction(false));
  }
}
