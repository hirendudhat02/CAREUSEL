import * as TYPES from '../Services/Type';

export function FcmTokenResponse(data) {
  return {
    type: TYPES.FCMTOKEN_RESPONSE,
    payload: data,
  };
}

export function FcmTokenRequest(bodydata, token) {
  return {
    type: TYPES.FCMTOKEN_REQUEST,
    bodydata: bodydata,
    token: token,
  };
}
