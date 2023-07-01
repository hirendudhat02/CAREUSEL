import * as TYPES from '../Services/Type';

export function VerificationResponse(data) {
  return {
    type: TYPES.VERIFICATION_RESPONSE,
    payload: data,
  };
}

export function VerificationRequest(bodydata) {
  return {
    type: TYPES.VERIFICATION_REQUEST,
    bodydata: bodydata,
  };
}
