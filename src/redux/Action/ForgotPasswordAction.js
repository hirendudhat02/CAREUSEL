import * as TYPES from '../Services/Type';

export function ForgotPasswordResponse(data) {
  return {
    type: TYPES.FORGOTPASSWORD_RESPONSE,
    payload: data,
  };
}

export function ForgotPasswordRequest(bodydata, navigation) {
  return {
    type: TYPES.FORGOTPASSWORD_REQUEST,
    bodydata: bodydata,
    navigation: navigation,
  };
}
