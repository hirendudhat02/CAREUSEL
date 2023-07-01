import AsyncStorage from '@react-native-async-storage/async-storage';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {EmailVerificationResponse} from '../Action/EmailVerificationAction';
import {loaderAction} from '../Action/LoaderAction';

export function* EmailVerificationSaga(action) {
  const {bodydata, resend} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.EMAILVERIFICATION,
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
      if (resend !== 'resend') {
        Toast.show('Verification code has been sent to your email.', 'success');
      }
      yield put(EmailVerificationResponse(responseJson));
      AsyncStorage.setItem('Forgot', JSON.stringify(bodydata));
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
