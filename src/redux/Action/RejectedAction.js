import * as TYPES from '../Services/Type';

export function RejectedResponse(data) {
  return {
    type: TYPES.REJECTED_RESPONSE,
    payload: data,
  };
}

export function RejectedRequest(payloade, token, navigation) {
  return {
    type: TYPES.REJECTED_REQUEST,
    bodydata: payloade,
    token: token,
    navigation: navigation,
  };
}
