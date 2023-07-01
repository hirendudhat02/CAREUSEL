import * as TYPES from '../Services/Type';

export function ForgotOtpResponse(data) {
  return {
    type: TYPES.FORGOTOTP_RESPONSE,
    payload: data,
  };
}

export function ForgotOtpRequest(bodydata) {
  return {
    type: TYPES.FORGOTOTP_REQUEST,
    bodydata: bodydata,
  };
}
