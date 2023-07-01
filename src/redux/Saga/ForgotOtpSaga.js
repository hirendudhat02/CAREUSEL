import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {ForgotOtpResponse} from '../Action/ForgotOtpAction';
import {loaderAction} from '../Action/LoaderAction';
export function* ForgotOtpSaga(action) {
  const {bodydata} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.FORGOTOTP,
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

    if (responseJson === true) {
      Toast.show('Email has been verified successfully', 'success');
      yield put(ForgotOtpResponse(responseJson));
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
