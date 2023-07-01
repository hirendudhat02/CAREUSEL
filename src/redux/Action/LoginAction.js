import * as TYPES from '../Services/Type';

export function LoginResponse(data) {
  return {
    type: TYPES.LOGIN_RESPONSE,
    payload: data,
  };
}

export function LoginRequest(bodydata, navigation) {
  return {
    type: TYPES.LOGIN_REQUEST,
    bodydata: bodydata,
    navigation: navigation,
  };
}
