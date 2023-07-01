import * as TYPES from '../Services/Type';

export function ChangePasswordResponse(data) {
  return {
    type: TYPES.CHNAGE_PASSWORD_RESPONSE,
    payload: data,
  };
}

export function ChangePasswordRequest(bodydata, token, navigation) {
  return {
    type: TYPES.CHANGE_PASSWORD_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
