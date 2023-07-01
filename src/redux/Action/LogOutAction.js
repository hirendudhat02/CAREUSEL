import * as TYPES from '../Services/Type';

export function LogOutResponse(data) {
  return {
    type: TYPES.LOGOUT_RESPONSE,
    payload: data,
  };
}

export function LogOutRequest(bodydata, token, navigation) {
  return {
    type: TYPES.LOGOUT_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
