import * as TYPES from '../Services/Type';

export function EmailVerificationResponse(data) {
  return {
    type: TYPES.EMAILVERIFICATION_RESPONSE,
    payload: data,
  };
}

export function EmailVerificationRequest(bodydata, resend, navigation) {
  return {
    type: TYPES.EMAILVERIFICATION_REQUEST,
    bodydata: bodydata,
    resend: resend,
    navigation: navigation,
  };
}
