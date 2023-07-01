import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {FcmTokenResponse} from '../Action/FcmTokenAction';
import {loaderAction} from '../Action/LoaderAction';

export function* FcmTokenSaga(action) {
  const {bodydata, token} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.FCMTOKEN,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(bodydata),
      },
    );
    var responseJson = yield response.json();

    console.log('responseJson:::', responseJson);
    if (responseJson.message === 'Token set successfully') {
      yield put(FcmTokenResponse(responseJson));
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
