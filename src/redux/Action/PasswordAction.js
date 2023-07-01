import * as TYPES from '../Services/Type';

export function PasswordResponse(data) {
  return {
    type: TYPES.PASSWORD_RESPONSE,
    payload: data,
  };
}

export function PasswordRequest(bodydata, navigation) {
  return {
    type: TYPES.PASSWORD_REQUEST,
    bodydata: bodydata,
    navigation: navigation,
  };
}
