import {Alert} from 'react-native';
import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {InvitedResponse} from '../Action/InvitedAction';
import {loaderAction} from '../Action/LoaderAction';

export function* RejectedStatusSaga(action) {
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
      Toast.show(responseJson.data.message, 'success');
      yield put(InvitedResponse(responseJson));
      yield put(loaderAction(false));
      navigation.goBack();
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
