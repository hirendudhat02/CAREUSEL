import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {ForgotPasswordResponse} from '../Action/ForgotPasswordAction';
import {loaderAction} from '../Action/LoaderAction';

export function* ForgotPasswordSaga(action) {
  const {bodydata, navigation} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.FORGOTPASSWORD,
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
      Toast.show(
        'Your Account Password has been changed successfully',
        'success',
      );

      yield put(ForgotPasswordResponse(responseJson));
      yield put(loaderAction(false));
      setTimeout(() => {
        navigation.pop();
      }, 1000);
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
