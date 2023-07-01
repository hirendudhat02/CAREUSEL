import AsyncStorage from '@react-native-async-storage/async-storage';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {loaderAction} from '../Action/LoaderAction';
import {MyProfileResponse} from '../Action/MyProfileAction';

export function* MyProfileSaga(action) {
  const {bodydata, navigation} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.PROFILE + bodydata.userId,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + bodydata.token,
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      },
    );
    var responseJson = yield response.json();
    if (responseJson.status === 'success') {
      yield put(MyProfileResponse(responseJson));
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
