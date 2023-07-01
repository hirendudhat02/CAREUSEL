import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import {loaderAction} from '../Action/LoaderAction';
import {BasicInfoResponse} from '../Action/BasucInfoAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../../utils/toast';
export function* basicInfoSaga(action) {
  const {bodydata, key} = action;
  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.BASICINFO,
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
      if (key === 'basicinfo') {
        Toast.show('Basic information filled successfully.', 'success');
      }
      AsyncStorage.setItem('SignUpData', JSON.stringify(bodydata));
      yield put(BasicInfoResponse(responseJson));
      yield put(loaderAction(false));
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
