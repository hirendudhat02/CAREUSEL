import {put} from 'redux-saga/effects';
import Constant from '../../helpers/Constant';
import Toast from '../../utils/toast';
import {GetEmailsResponse} from '../Action/GetEmailsAction';
import {loaderAction} from '../Action/LoaderAction';

export function* GetEmailsSaga(action) {
  const {bodydata} = action;

  try {
    const response = yield fetch(
      Constant.baseURL + Constant.end_Point.GETEMAILS,
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
      yield put(GetEmailsResponse(responseJson));
      yield put(loaderAction(false));
    } else {
      yield put(GetEmailsResponse(responseJson));
      yield put(loaderAction(false));
      //   Toast.show(responseJson.data.message, 'danger');
    }
  } catch (err) {
    console.log(err);
    Toast.show('Something went wrong', 'danger');
    yield put(loaderAction(false));
  }
}
