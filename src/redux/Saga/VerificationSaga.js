import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {loaderAction} from '../Action/LoaderAction';
import {VerificationResponse} from '../Action/VerificationAction';
export function* VerificationSaga(action) {
  const {bodydata} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.VERIFICATION,
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
    if (responseJson.message === 'Email verified successfully') {
      Toast.show(responseJson.message, 'success');
      yield put(VerificationResponse(responseJson));
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
